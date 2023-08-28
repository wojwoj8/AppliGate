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
from app import views


router = routers.DefaultRouter()
router.register(r"user", views.SignupView.as_view(), "signup")

urlpatterns = [
    path("admin/", admin.site.urls),
    # set endpoints
    path("register/", views.SignupView.as_view()),
    path("index/", views.IndexView.as_view()),
    # Profile for user
    path("profile/<str:username>/", views.ProfileView.as_view()),
    path("profile/uploadImage/<str:username>/", views.ProfileImageUploadView.as_view()),
    path("profile/contact/<str:username>/", views.ProfileContactView.as_view()),
    path("profile/experience/<str:username>/", views.ProfileExperienceView.as_view()),
    path(
        "profile/experience/<str:username>/<int:pk>",
        views.ProfileExperienceView.as_view(),
    ),
    path("profile/education/<str:username>/", views.ProfileEducationView.as_view()),
    path(
        "profile/education/<str:username>/<int:pk>",
        views.ProfileEducationView.as_view(),
    ),
    path("profile/course/<str:username>/", views.ProfileCourseView.as_view()),
    path("profile/course/<str:username>/<int:pk>", views.ProfileCourseView.as_view()),
    path("profile/language/<str:username>/", views.ProfileLanguageView.as_view()),
    path(
        "profile/language/<str:username>/<int:pk>", views.ProfileLanguageView.as_view()
    ),
    path("profile/skill/<str:username>/", views.ProfileSkillView.as_view()),
    path("profile/skill/<str:username>/<int:pk>", views.ProfileSkillView.as_view()),
    path("profile/link/<str:username>/", views.ProfileLinkView.as_view()),
    path("profile/link/<str:username>/<int:pk>", views.ProfileLinkView.as_view()),
    path("profile/about/<str:username>/", views.ProfileAboutView.as_view()),
    path("profile/summary/<str:username>/", views.ProfileSummaryView.as_view()),
    # SETTINGS
    path("profile/settings", views.ProfileChangeDataView.as_view()),
    path("profile/settings/<int:pk>", views.ProfileChangeDataView.as_view()),
    path(
        "profile/settings/changepassword/<int:pk>",
        views.ProfileChangePasswordView.as_view(),
    ),
    # Authentication
    path("api/", include("app.api.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
