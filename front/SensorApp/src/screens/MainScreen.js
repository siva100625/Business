import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, FlatList, Dimensions, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // Add Linear Gradient for background

const ITEM_HEIGHT = 60;
const screenWidth = Dimensions.get('window').width;

const ListItem = React.memo(({ item }) => {
  const backgroundColor = item.value > 1 ? '#763626' : 'green';

  return (
    <View style={[styles.dataItem, { backgroundColor }]}>
      <Text style={styles.itemText}>Value: {item.value}</Text>
      <Text style={styles.itemText}>Timestamp: {item.timestamp}</Text>
      <Text style={styles.itemText}>
        Status: {item.value > 750 ? 'Exceeds Threshold' : 'Normal'}
      </Text>
    </View>
  );
});

export default function MainScreen() {
  const [sensorData, setSensorData] = useState([]);
  const [ledStatus, setLedStatus] = useState('');
  const [thresholdExceeded, setThresholdExceeded] = useState(false);
  const [showLedControl, setShowLedControl] = useState(false); 
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.147.95/sensor-data/');
      setSensorData(response.data);

      const exceedsThreshold = response.data.some(item => item.value > 750);
      setThresholdExceeded(exceedsThreshold);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 10000);
    return () => clearInterval(intervalId);
  }, [fetchSensorData]);

  const handlePress = async () => {
    try {
      const response = await axios.post('http://192.168.147.95/api/blink-led/');
      setLedStatus(response.data.message);
    } catch (error) {
      console.error('Error posting to Django:', error);
    }
  };

  const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);

  const handleMenuOptionPress = (option) => {
    setShowMenu(false); 
    if (option === 'Visualize') {
      navigation.navigate('VisualizeScreen');
    } else if (option === 'Blink') {
      setShowLedControl(!showLedControl);
    }
  };

  return (
    <LinearGradient colors={['#FFF2D7', '#FFF2D7', '#FFF2D7']} style={styles.container}>
      {/* Taskbar with back button, Visualize button, and 'Blink' button */}
      <View style={styles.taskbar}>
        {showLedControl ? (
          <TouchableOpacity onPress={() => setShowLedControl(false)}>
            <Text style={styles.backButton}>{'<-'}</Text> 
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />  
        )}
        
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Icon name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal for Menu */}
      <Modal
        transparent={true}
        visible={showMenu}
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={[styles.menuItemContainer, { backgroundColor: '#f0f0f0' }]} 
              onPress={() => handleMenuOptionPress('Visualize')}
            >
              <Icon name="eye" size={20} color="black" />
              <Text style={styles.menuItemText}>Visualize</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.menuItemContainer, { backgroundColor: '#e0e0e0' }]} 
              onPress={() => handleMenuOptionPress('Blink')}
            >
              <Icon name="flash" size={20} color="black" />
              <Text style={styles.menuItemText}>Blink</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Conditionally render either sensor data or LED control */}
      {!showLedControl ? (
        <View style={styles.listContainer}>
          <FlatList
            data={sensorData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            getItemLayout={(data, index) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
          />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePress}
            style={[styles.button, { backgroundColor: thresholdExceeded ? 'red' : 'green' }]}
          >
            <Text style={styles.buttonText}>Blink LED</Text>
          </TouchableOpacity>
          <Text style={styles.ledStatus}>{ledStatus}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background for the taskbar
  },
  backButton: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  spacer: {
    width: 40, 
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: screenWidth * 0.8,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ledStatus: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  listContainer: {
    flex: 2,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dataItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(225, 225,225, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  menuItemText: {
    fontSize: 18,
    paddingLeft: 10,
  },
});