import { View, Text, Pressable } from 'react-native';
import React from 'react';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const InitialScreen = () => {
    const router = useRouter();

    const locationpermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
            router.push('Screens/CurrentLocationMapScreen');
        } else {
            router.push('Screens/ManualLocationMapScreen');
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Pressable
                className="absolute bottom-5 left-5 right-5 bg-[#E86C2C] py-4 rounded-lg"
                onPress={locationpermission}
            >
                <Text className="text-white text-center font-semibold text-base">
                    Add address
                </Text>
            </Pressable>
        </View>
    );
};

export default InitialScreen;
