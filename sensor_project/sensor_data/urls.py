# urls.py
from django.urls import path
from .views import register, login,plot_graph

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('plot-graph/', plot_graph, name='plot_graph'),

]