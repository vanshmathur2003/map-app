import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ConfirmLocation = () => {
  const router = useRouter()
  const mapRef = useRef(null);
  const [locationDetails, setLocationDetails] = useState({
    latitude: null,
    longitude: null,
    address: '',
    name: ''
  });
  
  const [formData, setFormData] = useState({
    houseNo: '',
    buildingName: '',
    landmark: '',
    receiverName: '',
    receiverPhone: '',
    petName: '',
    addressType: '' // 'home', 'office', or 'others'
  });

  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      const savedLocation = await AsyncStorage.getItem('selectedLocation');
      if (savedLocation) {
        const parsedLocation = JSON.parse(savedLocation);
        setLocationDetails(parsedLocation);
        console.log(parsedLocation)
        
        // Animate map to the saved location
        if (mapRef.current && parsedLocation.latitude && parsedLocation.longitude) {
          mapRef.current.animateToRegion({
            latitude: parsedLocation.latitude,
            longitude: parsedLocation.longitude,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error loading location data:', error);
    }
  };

  const handleAddressType = (type) => {
    setFormData(prev => ({ ...prev, addressType: type }));
  };

  const handleSaveAddress = async () => {
    try {
      const addressData = {
        ...locationDetails,
        ...formData
      };
      await AsyncStorage.setItem('savedAddress', JSON.stringify(addressData));
      console.log(addressData)
      
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="h-48">
        {locationDetails.latitude && locationDetails.longitude && (
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: locationDetails.latitude,
              longitude: locationDetails.longitude,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
          >
       <Marker
              coordinate={{
                latitude: locationDetails.latitude,
                longitude: locationDetails.longitude,
              }}
            >
              <View className="w-8 h-8 rounded-full bg-orange-500 items-center justify-center border-2 border-white">
                <View className="w-3 h-3 rounded-full bg-white" />
              </View>
            </Marker>
          </MapView>
        )}
      </View>

      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <MaterialIcons name="location-on" size={24} color="#f97316" />
          <View className="flex-1 ml-2">
            <Text className="font-semibold text-lg">{locationDetails.name}</Text>
            <Text className="text-gray-600">{locationDetails.address}</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('Screens/CurrentLocationMapScreen')}>
            <Text className="text-orange-500">Change</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-4">Enter complete address</Text>
        
        <View className="space-y-4">
          <TextInput
            placeholder="House No./Flat No."
            className="border border-gray-300 rounded-lg p-3 mb-1"
            value={formData.houseNo}
            onChangeText={(text) => setFormData(prev => ({ ...prev, houseNo: text }))}
          />
          
          <TextInput
            placeholder="Building name"
            className="border border-gray-300 rounded-lg p-3 mb-1"
            value={formData.buildingName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, buildingName: text }))}
          />
          
          <TextInput
            placeholder="Landmark"
            className="border border-gray-300 rounded-lg p-3 mb-1"
            value={formData.landmark}
            onChangeText={(text) => setFormData(prev => ({ ...prev, landmark: text }))}
          />

          <Text className="text-lg font-semibold mb-2">Save address as</Text>
          
          <View className="flex-row space-x-3 mb-3 gap-2">
            <TouchableOpacity 
              className={`border rounded-lg px-4 py-2 ${formData.addressType === 'home' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}
              onPress={() => handleAddressType('home')}
            >
              <Text className={formData.addressType === 'home' ? 'text-white' : 'text-gray-700'}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`border rounded-lg px-4 py-2 ${formData.addressType === 'office' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}
              onPress={() => handleAddressType('office')}
            >
              <Text className={formData.addressType === 'office' ? 'text-white' : 'text-gray-700'}>Office</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`border rounded-lg px-4 py-2 ${formData.addressType === 'others' ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}
              onPress={() => handleAddressType('others')}
            >
              <Text className={formData.addressType === 'others' ? 'text-white' : 'text-gray-700'}>Others</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Receiver's name"
            className="border border-gray-300 rounded-lg p-3 mb-1"
            value={formData.receiverName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, receiverName: text }))}
          />
          
          <TextInput
            placeholder="Receiver's phone number"
            className="border border-gray-300 rounded-lg p-3 mb-1"
            keyboardType="phone-pad"
            value={formData.receiverPhone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, receiverPhone: text }))}
          />
          
          <TextInput
            placeholder="Pet's name"
            className="border border-gray-300 rounded-lg p-3 mb-1"
            value={formData.petName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, petName: text }))}
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveAddress}
          className="bg-orange-500 rounded-lg py-4 mt-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Save address
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ConfirmLocation;