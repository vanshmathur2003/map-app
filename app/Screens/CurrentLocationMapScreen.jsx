import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { Marker } from 'react-native-maps';
import 'react-native-get-random-values'
// never remove the above import 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const CurrentLocationMapScreen = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true);
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef(null);
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    address: '',
    name: ''
  });

  const updateLocationDetails = async (latitude, longitude) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });

      if (response[0]) {
        const address = [
          response[0].street,
          response[0].district,
          response[0].city,
          response[0].region
        ].filter(Boolean).join(', ');

        setLocation({
          latitude,
          longitude,
          address,
          name: response[0].name || response[0].street || 'Selected Location'
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const moveToLocation = (latitude, longitude) => {
    setLocation(prev => ({
      ...prev,
      latitude,
      longitude
    }));

    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    }, 1000);

    updateLocationDetails(latitude, longitude);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      moveToLocation(currentLocation.coords.latitude, currentLocation.coords.longitude);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Getting Location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height, width }}>
        {location.latitude && location.longitude && (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            onRegionChangeComplete={(region) => {
              updateLocationDetails(region.latitude, region.longitude);
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            >
              <View className="w-8 h-8 rounded-full bg-orange-500 items-center justify-center border-2 border-white">
                <View className="w-3 h-3 rounded-full bg-white" />
              </View>
            </Marker>

          </MapView>
        )}
      </View>

      <View className="absolute top-0 left-0 right-0 px-4 pt-4 z-50">
        <GooglePlacesAutocomplete
          placeholder="Search area, street, name..."
          onPress={(data, details = null) => {
            if (details?.geometry) {
              moveToLocation(
                details.geometry.location.lat,
                details.geometry.location.lng
              );
            }
          }}
          query={{
            key: apiKey,
            language: 'en',
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          styles={{
            container: { flex: 0 },
            textInputContainer: {
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              elevation: 2,
            },
            textInput: {
              height: 44,
              color: '#5d5d5d',
              fontSize: 16,
              paddingHorizontal: 16,
            },
            listView: {
              backgroundColor: '#FFFFFF',
              borderRadius: 8,
              marginTop: 4,
            },
          }}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-3xl">
        <View className="flex-row items-start mb-4">
          <View className="w-8 h-8 bg-green-700 rounded-full items-center justify-center mr-2">
            <View className="w-2 h-2 bg-white rounded-full" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold mb-1">{location.name}</Text>
            <Text className="text-gray-600">{location.address}</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-orange-500">Change</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-orange-500 rounded-lg py-4"
          onPress={async () => {
            try {
              await AsyncStorage.setItem('selectedLocation', JSON.stringify(location));
              router.push('Screens/ConfirmLocation')
            } catch (error) {
              console.error('Error saving location:', error);
            }
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Confirm location
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => getCurrentLocation()}
        className="absolute bottom-48 left-4 right-4 bg-white rounded-lg py-3 flex-row justify-center items-center shadow-sm"
      >
        <View className="w-5 h-5 mr-2 border-2 border-orange-500 rounded-full items-center justify-center">
          <View className="w-1 h-1 bg-orange-500 rounded-full" />
        </View>
        <Text className="text-gray-700">Use current location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CurrentLocationMapScreen;