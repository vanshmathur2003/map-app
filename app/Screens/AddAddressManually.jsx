import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';

const AddAddressManually = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
    state: '',
    houseNo: '',
    buildingNo: '',
    name: '',
    mobile: '',
    petName: ''
  });

  const [isDefaultAddress, setIsDefaultAddress] = useState(false);

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const handleConfirmLocation = () => {

   if (!validatePhone(formData.mobile)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    console.log('Form Data:', formData);
    console.log('Is Default Address:', isDefaultAddress);

  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Enable Location Section */}
      <View className="bg-orange-50 p-4 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="mr-3">
            <Text className="text-2xl">🎯</Text>
          </View>
          <View>
            <Text className="font-semibold text-base">Enable location permission</Text>
            <Text className="text-gray-500 text-sm">Your precise location helps us deliver on time</Text>
          </View>
        </View>
        <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-medium">Enable</Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        {/* Address Section */}
        <Text className="text-lg font-semibold mb-4">Address</Text>
        <View className="space-y-4 ">
          <TextInput
            placeholder="Pincode"
            value={formData.pincode}
            onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
            className="bg-white p-4 rounded-xl mb-2"
          />

          <View className="flex-row space-x-4 gap-2">
            <TextInput
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
              className="bg-white p-4 rounded-xl flex-1 mb-2"
            />
            <TextInput
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
              className="bg-white p-4 rounded-xl flex-1 mb-2"
            />
          </View>

          <TextInput
            placeholder="House/Flat no."
            value={formData.houseNo}
            onChangeText={(text) => setFormData(prev => ({ ...prev, houseNo: text }))}
            className="bg-white p-4 rounded-xl mb-2"
          />

          <TextInput
            placeholder="Building no."
            value={formData.buildingNo}
            onChangeText={(text) => setFormData(prev => ({ ...prev, buildingNo: text }))}
            className="bg-white p-4 rounded-xl mb-2"
          />
        </View>

        {/* Receiver's Details Section */}
        <Text className="text-lg font-semibold mb-4 mt-6">Receiver's details</Text>
        <View className="space-y-4">
          <TextInput
            placeholder="Your name"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            className="bg-white p-4 rounded-xl mb-2"
          />

          <TextInput
            placeholder="Your mobile no."
            value={formData.mobile}
            onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
            className="bg-white p-4 rounded-xl mb-2"
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Your pet's name"
            value={formData.petName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, petName: text }))}
            className="bg-white p-4 rounded-xl mb-2"
          />
        </View>

        {/* Default Address Checkbox */}
        <TouchableOpacity
          className="flex-row items-center mt-6"
          onPress={() => setIsDefaultAddress(!isDefaultAddress)}
        >
          <View className={`w-6 h-6 rounded border items-center justify-center mr-2 ${isDefaultAddress ? 'bg-black border-black' : 'border-gray-300'}`}>
            {isDefaultAddress && <Text className="text-white">✓</Text>}
          </View>
          <Text className="text-base">Set as default address</Text>
        </TouchableOpacity>

        {/* Confirm Button */}
        <TouchableOpacity className="bg-orange-500 rounded-xl py-4 mt-6"
          onPress={handleConfirmLocation}>
          <Text className="text-white text-center font-semibold text-lg">
            Confirm location
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddAddressManually;