"""AppliGate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# from django.conf.urls import url
from rest_framework import routers

from company_app import views
from user_app.views import ProfileStatusView



urlpatterns = [

    # ProfileCompany for company
    path("company/profile/<str:username>/", views.ProfileCompanyView.as_view(), name="personalCompany"),
    # path("company/profile/<str:username>/", ProfileStatusView.as_view(), name="profileStatusView"),
    path("company/jobofferlistings", views.JobOfferListingView.as_view(), name="jobOfferListing"),
    path("company/joboffer", views.JobOfferListingView.as_view(), name="jobOffer"),
    path("company/joboffer/<int:id>", views.JobOfferCompanyView.as_view(), name="jobOfferCompanyData"),
    path("company/joboffer/top/<int:id>", views.JobOfferTopView.as_view(), name="JobOfferTopData"),
    
    # path("company/jobofferlistings/<str:username>/", views.JobOfferListing.as_view(), name="jobOfferListingIsername"),
    # list job offers created by company user
    path("company/myJobOffers", views.MyJobOffersListingView.as_view(), name="myJobOffers"),
    
    # path("company/joboffercreator/", views.ProfileCompanyView.as_view(), name="personalCompany"),
    
    
]

