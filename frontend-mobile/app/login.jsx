import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    // 1. Remove accidental spaces
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    console.log(`Attempting login with Email: [${cleanEmail}] and Password: [${cleanPassword}]`);

    setIsLoading(true);
    try {
      const response = await api.post('/users/login', { 
        email: cleanEmail, 
        password: cleanPassword 
      });
      
      // 1. Log the exact response to the terminal so we can see what Spring Boot sent!
      console.log("SUCCESS! Backend returned:", response.data);
      
      // 2. Safely save the token (handling both { token: "..." } and raw string responses)
      const token = response.data.token || response.data;
      await AsyncStorage.setItem('userToken', token);
      
      // 3. Only try to save user details if the 'user' object actually exists
      if (response.data.user) {
        await AsyncStorage.setItem('userId', response.data.user.id.toString());
        await AsyncStorage.setItem('userName', response.data.user.fullName);
        await AsyncStorage.setItem('userRole', response.data.user.role);
      } else {
        console.warn("Notice: No 'user' object found in response data.");
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      Alert.alert('Login Failed', 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  }; // <-- This closing bracket was missing!

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Society SaaS</Text>
        <Text style={styles.subtitle}>Welcome back, Neighbor!</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login to Community</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, justifyContent: 'center' },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  form: { gap: 16 },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    padding: 16, 
    borderRadius: 12, 
    fontSize: 16,
    color: '#0f172a'
  },
  button: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});