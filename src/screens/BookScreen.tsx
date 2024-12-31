import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  TextInput,
  Button as PaperButton,
  Card,
  Title,
  Paragraph,
  IconButton,
  Surface,
} from "react-native-paper";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
}

const BookScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      console.log("Books response:", response);
      if (response && response.data) {
        setBooks(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", error.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = () => {
    setSelectedBook(null);
    setFormData({
      title: "",
      author: "",
      description: "",
      genre: "",
    });
    setDialogVisible(true);
  };

  const handleEditBook = (book: Book) => {
    try {
      console.log("Editing book:", book);
      setSelectedBook(book);
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        genre: book.genre || "",
      });
      setDialogVisible(true);
    } catch (error) {
      console.error("Error in handleEditBook:", error);
      Alert.alert("Error", "Failed to load book data");
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Title is required");
      return false;
    }
    if (formData.title.trim().length < 3) {
      Alert.alert("Validation Error", "Title must be at least 3 characters");
      return false;
    }

    if (!formData.author.trim()) {
      Alert.alert("Validation Error", "Author is required");
      return false;
    }
    if (formData.author.trim().length < 3) {
      Alert.alert("Validation Error", "Author must be at least 3 characters");
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert("Validation Error", "Description is required");
      return false;
    }
    if (formData.description.trim().length < 10) {
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters"
      );
      return false;
    }

    if (!formData.genre.trim()) {
      Alert.alert("Validation Error", "Genre is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        description: formData.description.trim(),
        genre: formData.genre.trim(),
      };

      console.log("Submitting book data:", bookData);

      if (selectedBook) {
        try {
          console.log("Updating book with ID:", selectedBook._id);
          const response = await updateBook(selectedBook._id, bookData);
          console.log("Update response:", response);

          if (response && response.data) {
            setDialogVisible(false);
            await fetchBooks();
            Alert.alert("Success", "Book updated successfully");
          } else {
            throw new Error("Failed to update book");
          }
        } catch (error: any) {
          console.error("Update error:", error);
          Alert.alert("Error", error.message || "Failed to update book");
        }
      } else {
        try {
          const response = await createBook(bookData);
          console.log("Create response:", response);

          if (response && response.data) {
            setDialogVisible(false);
            await fetchBooks();
            Alert.alert("Success", "Book created successfully");
          } else {
            throw new Error("Failed to create book");
          }
        } catch (error: any) {
          console.error("Create error:", error);
          Alert.alert("Error", error.message || "Failed to create book");
        }
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to save book. Please check your input."
      );
    }
  };

  const handleDelete = (bookId: string) => {
    Alert.alert("Delete Book", "Are you sure you want to delete this book?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(bookId);
            Alert.alert("Success", "Book deleted successfully");
            fetchBooks();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete book");
          }
        },
      },
    ]);
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>Author: {item.author}</Paragraph>
        <Paragraph>Genre: {item.genre}</Paragraph>
        <Paragraph>Description: {item.description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <PaperButton onPress={() => handleEditBook(item)}>Edit</PaperButton>
        <PaperButton onPress={() => handleDelete(item._id)}>Delete</PaperButton>
      </Card.Actions>
    </Card>
  );

  const renderForm = () => (
    <Modal
      visible={dialogVisible}
      animationType="slide"
      onRequestClose={() => setDialogVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Surface style={styles.modalHeader}>
          <Title>{selectedBook ? "Edit Book" : "Add New Book"}</Title>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setDialogVisible(false)}
          />
        </Surface>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.formContainer}
        >
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <TextInput
              label="Title *"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Author *"
              value={formData.author}
              onChangeText={(text) =>
                setFormData({ ...formData, author: text })
              }
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Description *"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
              multiline
              numberOfLines={4}
              style={[styles.input, styles.multilineInput]}
              mode="outlined"
            />
            <TextInput
              label="Genre *"
              value={formData.genre}
              onChangeText={(text) => setFormData({ ...formData, genre: text })}
              style={styles.input}
              mode="outlined"
            />
          </ScrollView>

          <View style={styles.buttonContainer}>
            <PaperButton
              mode="outlined"
              onPress={() => setDialogVisible(false)}
              style={styles.button}
            >
              Cancel
            </PaperButton>
            <PaperButton
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
            >
              Save
            </PaperButton>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <PaperButton
        mode="contained"
        onPress={handleAddBook}
        style={styles.addButton}
        icon="plus"
      >
        Add New Book
      </PaperButton>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />

      {renderForm()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAF3E0", // Cream
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#333333", // Black
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  multilineInput: {
    maxHeight: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#333333", // Black
    borderRadius: 8,
  },
  addButton: {
    marginBottom: 16,
    backgroundColor: "#333333", // Black
    borderRadius: 8,
    color: "#FAF3E0", // Cream text
  },
  listContainer: {
    padding: 8,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default BookScreen;
