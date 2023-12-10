import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Button, StyleSheet, TextInput, Modal, Linking, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';


const App = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCamera, setShowCamera] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const profileImages = [
    'https://scontent-gru1-1.cdninstagram.com/v/t51.2885-19/405499829_312689531575189_108100010288194472_n.jpg?stp=dst-jpg_s320x320&_nc_ht=scontent-gru1-1.cdninstagram.com&_nc_cat=101&_nc_ohc=M5T4VACY2csAX-KElCT&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfD6Rdc86Gap3YQWsNQyULSBvSdMW8wKGZdzohtH8UWzlg&oe=657B93E1&_nc_sid=8b3546',
    'https://scontent-gru1-2.cdninstagram.com/v/t51.2885-15/401400046_1019049052504863_5448116872907943417_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0NDAuc2RyIn0&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=103&_nc_ohc=kanZMeRepWsAX9O9HrK&edm=ACWDqb8BAAAA&ccb=7-5&ig_cache_key=MzI0ODk0MDY4MjQ0NTg4NTQzMQ%3D%3D.2-ccb7-5&oh=00_AfCZFQr76oG6a5S4E3gXjUMR3g6L24VUe1Jq1LLXkSRyIQ&oe=657A1E4D&_nc_sid=ee9879',
    'https://scontent-gru1-2.cdninstagram.com/v/t51.2885-15/405512672_329493106467411_4322789339949627920_n.heic?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi44NTZ4ODU2LnNkciJ9&_nc_ht=scontent-gru1-2.cdninstagram.com&_nc_cat=103&_nc_ohc=iDBmXf1HaoAAX8THtuY&edm=ACWDqb8BAAAA&ccb=7-5&ig_cache_key=MzI0ODkzMTIwMDc4NTY4NTE3NQ%3D%3D.2-ccb7-5&oh=00_AfCozjysnifQrMadgMFeOKz9jlX-4M0MIgFHtfB6BpcVNA&oe=65793F5F&_nc_sid=ee9879',
  ];


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Função para trocar a imagem de perfil
  const changeProfileImage = () => {
    if (currentImageIndex < profileImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  let camera;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleGoBack = () => {
    setShowCamera(false);
  };

  const handleToggleCamera = () => {
    setShowCamera(!showCamera);
  };

  const takePicture = async () => {
    if (camera) {
      try {
        const { uri } = await camera.takePictureAsync();
        console.log('Foto tirada:', uri);

        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync('MyAppPhotos', asset, false);
        console.log('Foto salva no armazenamento local');
      } catch (error) {
        console.error('Erro ao tirar a foto:', error);
      }
    }
  };

  const sendSMS = () => {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openMaps = () => {
    const url = 'https://www.google.com/maps/search/?api=1&query=';
    Linking.openURL(url);
  };

  const handleLoginCadastro = () => {
    setLoginModalVisible(true);
  };

  const [loggedInEmail, setLoggedInEmail] = useState('');

  const handleLogin = () => {

    setLoggedInEmail(email);
    setLoggedIn(true);
    setLoginModalVisible(false);
  };

  const handleGoogleLogin = () => {
    setLoggedIn(true);
    setLoginModalVisible(false);
  };

  const handleProfile = () => {
    setProfileModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {!showCamera && !loggedIn && (
        <>
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginCadastro}>
            <Text style={styles.loginButtonText}>Login/Cadastro</Text>
          </TouchableOpacity>
        </>
      )}

      {loggedIn && (
        <TouchableOpacity style={styles.profileButton} onPress={handleProfile}>
          <Text style={styles.profileButtonText}>Perfil</Text>
        </TouchableOpacity>
      )}

      {!showCamera && loggedIn && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleToggleCamera}>
            <Text style={styles.buttonText}>Abrir Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Configurar SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openMaps}>
            <Text style={styles.buttonText}>Localização GPS</Text>
          </TouchableOpacity>
        </>
      )}

      {showCamera && (
        <Camera style={styles.camera} type={type} ref={(ref) => (camera = ref)}>
          <View style={styles.cameraButtonsContainer}>
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCameraType}>
              <Text style={styles.cameraButtonText}>Trocar câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={takePicture}>
              <Text style={styles.cameraButtonText}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={handleGoBack}>
              <Text style={styles.cameraButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}

      {showCamera || (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Configurar SMS</Text>
              <TextInput
                style={styles.input}
                placeholder="Número de Telefone"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
              />
              <Button title="Enviar SMS" onPress={sendSMS} />
              <Button title="Fechar" onPress={toggleModal} />
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}>
        <View style={styles.loginModalContainer}>
          <View style={styles.loginModalContent}>
            <Text style={styles.modalText}>Login/Cadastro</Text>
            <TextInput
              style={[styles.input, styles.emailInput]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showPasswordButtonText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
            </TouchableOpacity>
            <Button title="Login" onPress={handleLogin} />
            <Button title="Fechar" onPress={() => setLoginModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalContent}>
            <Text style={styles.modalText}>Perfil</Text>
            <Image source={{ uri: profileImages[currentImageIndex] }} style={styles.profileImage} />
            <Text style={styles.profileText}>Nome: Yan M. da Rocha</Text>
            <Text style={styles.profileText}>Email: {loggedInEmail}</Text>
            <Button title="Trocar Imagem de Perfil" onPress={changeProfileImage} />
            <Button title="Fechar" onPress={() => setProfileModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'yellow',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  cameraButton: {
    padding: 15,
    backgroundColor: 'yellow',
    borderRadius: 8,
  },
  cameraButtonText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: 300,
  },
  emailInput: {
    marginBottom: 20,
  },
  passwordInput: {
    marginBottom: 20,
  },
  showPasswordButton: {
    marginBottom: 20,
  },
  loginButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'yellow',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 16,
    color: 'black',
  },
  loginModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loginModalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  googleButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  googleButtonImage: {
    width: 30,
    height: 30,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    marginLeft: 10,
  },
  showPasswordButtonText: {
    color: 'yellow',
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'yellow',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  profileButtonText: {
    fontSize: 14,
    color: 'black',
  },
  profileModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileModalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default App;
