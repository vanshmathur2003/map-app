import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManualLocationMapScreen = () => {
  const router = useRouter();
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleEnableLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      router.push('Screens/CurrentLocationMapScreen');
    }
  };

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      {/* Location Permission Section */}
      <View className="flex-row items-center justify-between bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <View className="flex-row items-center flex-1">
          <View className="mr-3">
            <Text className="text-2xl">🎯</Text>
          </View>
          <View className="flex-1">
            <Text className="font-semibold">Enable location permission</Text>
            <Text className="text-gray-500 text-sm">Your precise location helps us deliver on time</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleEnableLocation}
          className="bg-orange-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Enable</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="mb-4">
        <GooglePlacesAutocomplete
          placeholder="Search area, street, name..."
          onPress={async (data, details = null) => {
            if (details?.geometry?.location) {
              const location = details.geometry.location;

              // Add additional fields
              const locationDetails = {
                latitude: location.lat,
                longitude: location.lng,
                address: data.description, // Full address from the search result
                name: details.name || 'Unnamed Location', // Fallback to a default name
              };

              // Save the location details in AsyncStorage
              await AsyncStorage.setItem('selectedLocation', JSON.stringify(locationDetails));

              // Navigate to the confirmation screen
              router.push('Screens/ConfirmLocation');
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
              borderWidth: 1,
              borderColor: '#E5E7EB',
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

      {/* Manual Address Button */}
      <TouchableOpacity 
        onPress={() => router.push('Screens/AddAddressManually')} 
        className="flex-row items-center p-4 bg-gray-100 rounded-md"
      >
        <View className="mr-3">
          <Text className="text-2xl">📍</Text>
        </View>
        <Text className="text-orange-500 font-medium">Add address manually</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ManualLocationMapScreen;
