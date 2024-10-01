#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

const int analogPin = A0;               // Analog pin for sensor
const int ledPin = 2;                   // LED pin
const int DHTPin = 14;                  // Pin for DHT11
const float Vcc = 3.3;                  // ESP8266 supply voltage
const float sensorMaxVoltage = 3.3;     // Max voltage from sensor
const float BAC_scale = 0.1;            // BAC scaling factor
const float legal_BAC_limit = 0.03;     // Legal BAC limit

#define DHTTYPE DHT11                   // DHT11 sensor type

DHT dht(DHTPin, DHTTYPE);               // Initialize DHT sensor

// Wi-Fi credentials
const char* ssid = "realme 9i 5G";       // Replace with your Wi-Fi SSID
const char* password = "123456781";      // Replace with your Wi-Fi password

// Django server details
const char* serverHost = "192.168.138.25";  // IP address of the Django server
const int serverPort = 80;                  // HTTP server port
const char* sensorDataEndpoint = "/sensor-data/";  // Django endpoint for sensor data

void setup() {
  Serial.begin(9600);

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);  
  dht.begin();

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");
}

void loop() {
  int sensorValue = analogRead(analogPin);
  float voltage = sensorValue * (Vcc / 1023.0);
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Temperature compensation
  float temp_compensation_factor = 1.0;
  if (temperature > 25) {
    temp_compensation_factor = 1.0 - ((temperature - 25) * 0.015); 
  } else if (temperature < 25) {
    temp_compensation_factor = 1.0 + ((25 - temperature) * 0.015);  
  }
  
  // Humidity compensation
  float humidity_compensation_factor = 1.0;
  if (humidity > 50) {
    humidity_compensation_factor = 1.0 + ((humidity - 50) * 0.01); 
  } else if (humidity < 50) {
    humidity_compensation_factor = 1.0 - ((50 - humidity) * 0.01);  
  }
  
  float compensated_voltage = voltage * temp_compensation_factor * humidity_compensation_factor;
  float BAC = (compensated_voltage / sensorMaxVoltage) * BAC_scale;

  Serial.print("Estimated BAC: ");
  Serial.print(BAC, 4);  
  Serial.println(" %");

  // LED warning
  if (BAC > legal_BAC_limit) {
    Serial.println("WARNING: BAC exceeds legal limit!");
    digitalWrite(ledPin, HIGH); 
  } else {
    digitalWrite(ledPin, LOW);   
  }

  // Send BAC and timestamp to Django server
  sendBACToDjango(BAC);
  
  delay(2000);
}

void sendBACToDjango(float BAC) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    if (client.connect(serverHost, serverPort)) {  // Connect to Django server
      
      unsigned long currentTime = millis();  // Get elapsed time since Arduino started
      String jsonPayload = String("{\"bac\":") + BAC + ",\"timestamp\":" + currentTime + "}";
      
      client.println("POST " + String(sensorDataEndpoint) + " HTTP/1.1");  // Send POST request
      client.println("Host: " + String(serverHost));
      client.println("Content-Type: application/json");
      client.println("Content-Length: " + String(jsonPayload.length()));
      client.println("Connection: close");
      client.println();
      client.println(jsonPayload);
      
      // Read response from server
      while (client.available()) {
        String line = client.readStringUntil('\n');
        Serial.println(line);
      }
      
      client.stop();
    } else {
      Serial.println("Failed to connect to server");
    }
  } else {
    Serial.println("WiFi not connected");
  }
}
