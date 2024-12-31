import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  TextInput,
  IconButton,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserProfile } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface UserProfile {
  username: string;
  email: string;
  name: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(
    "https://i.pinimg.com/736x/34/39/c8/3439c88fc95848798dcc09c6b8de9857.jpg"
  );
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserProfile();
      setProfile(userData);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {profileImage ? (
          <Avatar.Image size={100} source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <Avatar.Icon size={100} icon="account" style={styles.avatar} color="#fff" />
        )}
        <Title style={styles.name}>{profile?.name || "User"}</Title>
        <Paragraph style={styles.username}>@{profile?.username}</Paragraph>
      </View>

      <TextInput
        label="Image URL"
        value={imageUrl}
        onChangeText={(text) => setImageUrl(text)}
        style={styles.input}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={() => setProfileImage(imageUrl)}
        style={styles.changeImageButton}
      >
        Set Profile Picture
      </Button>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.infoRow}>
            <IconButton icon="email" size={24} />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profile?.email}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Books" as never)}
            style={styles.actionButton}
            icon="book-multiple"
          >
            Manage Books
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
            textColor="#e74c3c"
          >
            Logout
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC", // Cream
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#333", // Black
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#F5F5DC", // Cream
    marginBottom: 10,
  },
  name: {
    color: "#F5F5DC", // Cream
    fontSize: 24,
    fontWeight: "bold",
  },
  username: {
    color: "rgba(245, 245, 220, 0.8)", // Light Cream
    fontSize: 16,
  },
  input: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  changeImageButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#333", // Black
  },
  infoCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#F5F5DC", // Cream
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333", // Black
    fontWeight: "500",
  },
  actionsCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#F5F5DC", // Cream
  },
  actionButton: {
    marginBottom: 12,
    backgroundColor: "#333", // Black
  },
  logoutButton: {
    borderColor: "#e74c3c",
  },
});

export default ProfileScreen;
