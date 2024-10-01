from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import SensorData
from .serializers import SensorDataSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer

THRESHOLD_VALUE = 0.03

class SensorDataViewSet(viewsets.ModelViewSet):
    queryset = SensorData.objects.all().order_by('-timestamp')
    serializer_class = SensorDataSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        data = response.data

        if data['value'] > THRESHOLD_VALUE:
            return Response({"message": "Alert! Value exceeds threshold", "blink": True}, status=status.HTTP_201_CREATED)
        
        return response

# User registration and login views

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'username': user.username}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    return Response({'status': 'error', 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Graph plotting view
import matplotlib.pyplot as plt
import io
from django.http import HttpResponse
from .models import SensorData

def plot_graph(request):
    data = SensorData.objects.all().order_by('-timestamp')[:10]
    values = [d.value for d in data]
    timestamps = [d.timestamp.strftime("%H:%M") for d in data]

    # Create the figure and axis
    fig, ax = plt.subplots()
    ax.bar(timestamps, values)

    # Format the graph
    ax.set_xlabel('Timestamp')
    ax.set_ylabel('Sensor Value')
    ax.set_title('Sensor Data over Time')

    # Convert plot to PNG image
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig)
    buf.seek(0)

    # Serve the image as HTTP response
    return HttpResponse(buf, content_type='image/png')
