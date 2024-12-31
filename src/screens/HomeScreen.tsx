import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Paragraph, Text, Button } from "react-native-paper";
import { getAllBooks } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
}

const HomeScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Books")}
        style={styles.manageButton}
      >
        Manage Books
      </Button>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Manga&Manhwa yang tersedia</Text>
        {books.length === 0 ? (
          <Text style={styles.noBooks}>No books available</Text>
        ) : (
          books.map((book) => (
            <Card key={book._id} style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>{book.title}</Title>
                <Paragraph style={styles.author}>By: {book.author}</Paragraph>
                <Paragraph style={styles.genre}>Genre: {book.genre}</Paragraph>
                <Paragraph numberOfLines={3} style={styles.description}>
                  {book.description}
                </Paragraph>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC", // Cream
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  manageButton: {
    marginVertical: 20,
    backgroundColor: "#333", // Black
    borderRadius: 10,
    paddingVertical: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333", // Black
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF", // White
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000", // Black
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Black
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666", // Gray
    marginBottom: 6,
  },
  genre: {
    fontSize: 16,
    color: "#444", // Dark Gray
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: "#333", // Black
    lineHeight: 22,
  },
  noBooks: {
    fontSize: 18,
    textAlign: "center",
    color: "#666", // Gray
    marginTop: 30,
  },
});

export default HomeScreen;
