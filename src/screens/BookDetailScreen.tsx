import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { getBookDetail } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface BookDetail {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  publishedYear: number;
  genre: string;
}

const BookDetailScreen = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookDetail();
  }, []);

  const fetchBookDetail = async () => {
    try {
      const data = await getBookDetail(bookId);
      setBook(data);
    } catch (error) {
      console.error("Error fetching book detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Oops! Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: book.coverImage }} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>By: {book.author}</Text>
        <Text style={styles.info}>Genre: {book.genre}</Text>
        <Text style={styles.info}>Published Year: {book.publishedYear}</Text>
        <Text style={styles.description}>{book.description}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC", // Cream
    padding: 10,
  },
  coverImage: {
    width: "100%",
    height: 350,
    borderRadius: 12,
    marginBottom: 16,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#333333", // Black
    borderRadius: 10,
    shadowColor: "#000000", // Black shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F5F5DC", // Cream
    textAlign: "center",
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    fontWeight: "500",
    color: "#F5F5DC", // Cream
    textAlign: "center",
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: "#F5F5DC", // Cream
    marginBottom: 6,
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#F5F5DC", // Cream
    marginTop: 10,
    textAlign: "justify",
  },
  errorText: {
    fontSize: 20,
    color: "#FF6347", // Red
    textAlign: "center",
    marginTop: 20,
  },
});

export default BookDetailScreen;
