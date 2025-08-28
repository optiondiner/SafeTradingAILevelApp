# ---------------------------
# Google Mobile Ads
# ---------------------------
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.android.gms.common.** { *; }
-dontwarn com.google.android.gms.**

# ---------------------------
# Firebase (if used)
# ---------------------------
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# ---------------------------
# React Native Core
# ---------------------------
-keep class com.facebook.react.** { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactModule *;
}

# Keep TurboModules + Fabric
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.fabric.** { *; }

# ---------------------------
# Hermes
# ---------------------------
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-dontwarn com.facebook.hermes.**
-dontwarn com.facebook.jni.**

# ---------------------------
# App specific classes
# ---------------------------
-keep class com.safetradingailevelapp.MainActivity { *; }
-keep class com.safetradingailevelapp.MainApplication { *; }

# ---------------------------
# Annotations
# ---------------------------
-keep class androidx.annotation.Keep

# ---------------------------
# Networking (OkHttp, Retrofit, Gson)
# ---------------------------
-dontwarn okhttp3.**
-keep class okhttp3.** { *; }

-dontwarn retrofit2.**
-keep class retrofit2.** { *; }

-dontwarn com.google.gson.**
-keep class com.google.gson.** { *; }

# ---------------------------
# Optional - Keep line numbers for better crash logs
# ---------------------------
-keepattributes SourceFile,LineNumberTable

# ---------------------------
# Optional - Kotlin (if used in RN libs)
# ---------------------------
-dontwarn kotlin.**
