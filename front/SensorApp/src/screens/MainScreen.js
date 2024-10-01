import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, FlatList, Dimensions, Modal } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient'; // Add Linear Gradient for background

const ITEM_HEIGHT = 60;
const screenWidth = Dimensions.get('window').width;

const ListItem = React.memo(({ item }) => {
  const backgroundColor = item.value > 3 ? '#1C2C49' : '#2B7A77'; // Navy and teal colors

  return (
    <View style={[styles.dataItem, { backgroundColor }]}>
      <Text style={styles.itemText}>Value: {item.value}</Text>
      <Text style={styles.itemText}>
        Status: {item.value > 3 ? 'Excessive' : 'Normal'}
      </Text>
    </View>
  );
});

export default function MainScreen() {
  const [sensorData, setSensorData] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.138.25/sensor-data/');
      setSensorData(response.data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  }, []);

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 10000);
    return () => clearInterval(intervalId);
  }, [fetchSensorData]);

  const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);

  const handleMenuOptionPress = (option) => {
    setShowMenu(false); 
    if (option === 'Visualize') {
      navigation.navigate('VisualizeScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Taskbar with back button and Visualize button */}
      <View style={styles.taskbar}>
        <View style={styles.spacer} />
        
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Icon name="menu" size={24} color="#e6f0ff" />
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
              style={[styles.menuItemContainer, { backgroundColor: '#e6f0ff' }]} 
              onPress={() => handleMenuOptionPress('Visualize')}
            >
              <Icon name="eye" size={20} color="#003366" />
              <Text style={styles.menuItemText}>Visualize</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Render sensor data */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e0e', // Dark background color matching the image
  },
  taskbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#003366', // Dark blue background
  },
  spacer: {
    width: 40, 
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
    marginVertical: 8, // Increased margin to match the spacing in the image
  },
  itemText: {
    fontSize: 16,
    color: 'white', // White text
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
    color: '#003366', // Dark blue text
  },
});