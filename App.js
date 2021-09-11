import React from 'react';
import { View, Text, Button } from 'react-native';
import { firebaseApp } from './FirebaseConfig';
import firestore from '@react-native-firebase/firestore';
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";


const App = () => {

   const adicionar = () => {
      // Compute the GeoHash for a lat/lng point
      const lat = -2.6138411;
      const lng = -44.2544649;
      const hash = geohashForLocation([lat, lng]);

      // Add the hash and the lat/lng to the document. We will use the hash
      // for queries and the lat/lng for distance comparisons.
      const londonRef = firestore().collection('cities').doc('SLZ');
      londonRef.update({
         geohash: hash,
         lat: lat,
         lng: lng
      }).then(() => {
        console.warn('Deu certo')
      });
   }

   const buscar = () => {
      // Encontre cidades a 50 km de Londres
      const center = [51.5074, 0.1278];
      const radiusInM = 50 * 1000;

      // Cada item em 'limites' representa um par startAt / endAt. Temos que emitir
      // uma consulta separada para cada par. Pode haver até 9 pares de limites
      // dependendo da sobreposição, mas na maioria dos casos há 4.
      const bounds = geohashQueryBounds(center, radiusInM);
      const promises = [];
      for (const b of bounds) {
        const q = firestore().collection('cities')
          .orderBy('geohash')
          .startAt(b[0])
          .endAt(b[1]);

        promises.push(q.get());
      }

      // Colete todos os resultados da consulta em uma única lista
      Promise.all(promises).then((snapshots) => {
        const matchingDocs = [];

        for (const snap of snapshots) {
          for (const doc of snap.docs) {
            const lat = doc.get('lat');
            const lng = doc.get('lng');

            // Temos que filtrar alguns falsos positivos devido ao GeoHash
            // precisão, mas a maioria corresponderá
            const distanceInKm = distanceBetween([lat, lng], center);
            const distanceInM = distanceInKm * 1000;
            if (distanceInM <= radiusInM) {
              matchingDocs.push(doc);
            }
          }
        }

        return matchingDocs;
      }).then((matchingDocs) => {
        // Processa os documentos correspondentes
        // ...
        console.log(matchingDocs)
      });
   }

   return (
      <View>
         <Text>Teste Find Geo</Text>
         <Button title={'Adicionar'} onPress={() => adicionar()} color={'gray'} />
          <Text>Buscar</Text>
         <Button title={'Procurar'} onPress={() => buscar()} color={'#EDBC00'} />
      </View>
   )
}

export default App