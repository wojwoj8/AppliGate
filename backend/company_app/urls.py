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
    path("jobofferlistings/<int:page>", views.JobOfferListingView.as_view(), name="jobOfferListing"),
    # path("company/joboffer", views.JobOfferListingView.as_view(), name="jobOffer"),
    path("company/joboffer/createjoboffer", views.JobOfferCreateOfferView.as_view(), name="jobOfferCreateJobOffer"),
    path("company/joboffer/apply/<int:id>", views.JobApplicationView.as_view(), name="jobApply"),
    path("applications/<int:page>", views.JobOfferUserAppliedListingView.as_view(), name="jobUserApplications"),
    
    

    path("company/joboffer/info", views.JobOfferCompanyView.as_view(), name="jobOfferCompanyData"),
    path("company/joboffer/top", views.JobOfferTopView.as_view(), name="JobOfferTopData"),
    path("company/joboffer/info/<int:id>", views.JobOfferCompanyView.as_view(), name="jobOfferCompanyDataId"),
    path("company/joboffer/top/<int:id>", views.JobOfferTopView.as_view(), name="JobOfferTopDataId"),
    path("company/joboffer/topmore", views.JobOfferTopMoreView.as_view(), name="JobOfferTopMoreData"),
    path("company/joboffer/topmore/<int:id>", views.JobOfferTopMoreView.as_view(), name="JobOfferTopMoreDataId"),

    path("company/joboffer/topcolors", views.JobOfferTopColorsView.as_view(), name="JobOfferTopColorsData"),
    path("company/joboffer/topcolors/<int:id>", views.JobOfferTopColorsView.as_view(), name="JobOfferTopColorsDataId"),
    
    path("company/joboffer/skill", views.JobOfferSkillView.as_view(), name="JobOfferSkillData"),
    path("company/joboffer/skill/<int:id>", views.JobOfferSkillView.as_view(), name="JobOfferSkillDataId"),
    path("company/joboffer/skill/delete/<int:item_id>", views.JobOfferSkillView.as_view(), name="JobOfferSkillDataId"),
    
    path("company/joboffer/responsibility", views.JobOfferResponsibilityView.as_view(), name="JobOfferResponsibilityData"),
    path("company/joboffer/responsibility/<int:id>", views.JobOfferResponsibilityView.as_view(), name="JobOfferResponsibilityDataId"),
    path("company/joboffer/responsibility/edit/<int:item_id>", views.JobOfferResponsibilityView.as_view(), name="JobOfferResponsibilityDataId"),
    path("company/joboffer/responsibility/delete/<int:item_id>", views.JobOfferResponsibilityView.as_view(), name="JobOfferResponsibilityDataId"),

    path("company/joboffer/requirement", views.JobOfferRequirementView.as_view(), name="JobOfferRequirementData"),
    path("company/joboffer/requirement/<int:id>", views.JobOfferRequirementView.as_view(), name="JobOfferRequirementDataId"),
    path("company/joboffer/requirement/edit/<int:item_id>", views.JobOfferRequirementView.as_view(), name="JobOfferRequirementDataId"),
    path("company/joboffer/requirement/delete/<int:item_id>", views.JobOfferRequirementView.as_view(), name="JobOfferRequirementDataId"),

    path("company/joboffer/weoffer", views.JobOfferWhatWeOfferView.as_view(), name="JobOfferWhatWeOfferData"),
    path("company/joboffer/weoffer/<int:id>", views.JobOfferWhatWeOfferView.as_view(), name="JobOfferWhatWeOfferDataId"),
    path("company/joboffer/weoffer/edit/<int:item_id>", views.JobOfferWhatWeOfferView.as_view(), name="JobOfferWhatWeOfferDataId"),
    path("company/joboffer/weoffer/delete/<int:item_id>", views.JobOfferWhatWeOfferView.as_view(), name="JobOfferWhatWeOfferDataId"),

    path("company/joboffer/application", views.JobOfferApplicationView.as_view(), name="JobOfferApplicationData"),
    path("company/joboffer/application/<int:id>", views.JobOfferApplicationView.as_view(), name="JobOfferApplicationDataId"),
    path("company/joboffer/application/edit/<int:item_id>", views.JobOfferApplicationView.as_view(), name="JobOfferApplicationDataId"),
    path("company/joboffer/application/delete/<int:item_id>", views.JobOfferApplicationView.as_view(), name="JobOfferApplicationDataId"),

    path("company/joboffer/jobofferstatus", views.JobOfferStatusView.as_view(), name="JobOfferStatuData"),
    path("company/joboffer/jobofferstatus/<int:id>", views.JobOfferStatusView.as_view(), name="JobOfferStatuDataId"),

    path("company/joboffer/deleteoffer/<int:pk>", views.JobOfferDeleteOfferView.as_view(), name="JobOfferDeleteOffer"),
    
    path("company/joboffer/about", views.JobOfferAboutView.as_view(), name="JobOfferAbout"),
    path("company/joboffer/about/<int:id>", views.JobOfferAboutView.as_view(), name="JobOfferAboutId"),
    
    # path("company/jobofferlistings/<str:username>/", views.JobOfferListing.as_view(), name="jobOfferListingIsername"),
    # list job offers created by company user
    path("company/myJobOffers", views.MyJobOffersListingView.as_view(), name="myJobOffers"),
    # list job offers created by company user for profile display
    path("company/myJobOffers/<str:username>/", views.MyJobOffersListingView.as_view(), name="myJobOffersProfile"),
    
    # path("company/joboffercreator/", views.ProfileCompanyView.as_view(), name="personalCompany"),
    
    
]

