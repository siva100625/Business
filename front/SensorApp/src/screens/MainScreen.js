import React, { useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, View, StyleSheet, Text, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import navigation for Visualize button

const ITEM_HEIGHT = 60; 
const screenWidth = Dimensions.get('window').width; 

const ListItem = React.memo(({ item }) => {
  const backgroundColor = item.value > 1 ? 'red' : 'green';

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
  const [showLedControl, setShowLedControl] = useState(false); // State for toggling views
  const navigation = useNavigation(); // Hook for navigating

  const fetchSensorData = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.219.25/sensor-data/');
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
      const response = await axios.post('http://192.168.219.25/api/blink-led/');
      setLedStatus(response.data.message);
    } catch (error) {
      console.error('Error posting to Django:', error);
    }
  };

  const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);

  return (
    <View style={styles.container}>
      {/* Taskbar with back button, Visualize button, and 'Blink' button */}
      <View style={styles.taskbar}>
        {showLedControl ? (
          <TouchableOpacity onPress={() => setShowLedControl(false)}>
            <Text style={styles.backButton}>{'<-'}</Text> 
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />  // Placeholder for back button alignment
        )}
        
        {/* Centered Visualize Button */}
        <TouchableOpacity onPress={() => navigation.navigate('VisualizeScreen')}>
          <Text style={styles.visualizeButton}>Visualize</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowLedControl(!showLedControl)}>
          <Text style={styles.taskbarButton}>Blink</Text>
        </TouchableOpacity>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskbar: {
    height: 50,
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
  },
  taskbarButton: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
  },
  visualizeButton: {
    fontSize: 18,
    color: 'blue',
    fontWeight: 'bold',
    textAlign: 'center', // Center the text of the button
  },
  spacer: {
    width: 40, // Width of the spacer, matching the back button width
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
    color: 'gray',
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
});