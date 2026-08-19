import { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/imageUploadCardStyles';

export default function ImageUploadCard({ label, onImageSelected }) {
  const [imageUri, setImageUri] = useState(null);

  const handlePickImage = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImageUri(uri);
      onImageSelected && onImageSelected(uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    onImageSelected && onImageSelected(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>

      <TouchableOpacity style={styles.imageArea} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>Toque para adicionar uma imagem</Text>
        )}
      </TouchableOpacity>

      {imageUri && (
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
          <Text style={styles.removeButtonText}>Remover imagem</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
