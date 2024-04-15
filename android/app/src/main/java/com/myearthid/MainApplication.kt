package com.myearthid

import android.app.Application
import android.content.Context
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.microsoft.codepush.react.CodePush
import org.devio.rn.splashscreen.SplashScreenReactPackage
import fr.snapp.imagebase64.RNImgToBase64Package
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage
import com.reactnativecommunity.cameraroll.CameraRollPackage
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage
import fr.greweb.reactnativeviewshot.RNViewShotPackage
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage
import com.rnfs.RNFSPackage
import com.RNFetchBlob.RNFetchBlobPackage
import com.learnium.RNDeviceInfo.RNDeviceInfo
import com.azendoo.reactnativesnackbar.SnackbarPackage
import org.reactnative.camera.RNCameraPackage
import com.horcrux.svg.SvgPackage
import com.BV.LinearGradient.LinearGradientPackage
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader
import com.myearthid.newarchitecture.MainApplicationReactNativeHost
import java.lang.reflect.InvocationTargetException

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost: ReactNativeHost = object : ReactNativeHost(this) {
        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getPackages(): List<ReactPackage> {
            val packages: List<ReactPackage>
            packages = PackageList(this@MainApplication).packages
            SplashScreenReactPackage()
            ShareMenuPackage()
            RNVersionCheckPackage()
            CodePush("00844653-ea43-466d-adc9-5ac0a4eabbeb", this@MainApplication, BuildConfig.DEBUG)
            return packages
        }

        override fun getJSMainModuleName(): String {
            return "index"
        }

        override fun getJSBundleFile(): String {
            return CodePush.getJSBundleFile()
        }
    }

    private val mNewArchitectureNativeHost: ReactNativeHost = MainApplicationReactNativeHost(this)

    override fun getReactNativeHost(): ReactNativeHost {
        return if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            mNewArchitectureNativeHost
        } else {
            mReactNativeHost
        }
    }

    override fun onCreate() {
        super.onCreate()
        // If you opted-in for the New Architecture, we enable the TurboModule system
        ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        SoLoader.init(this, /* native exopackage */ false)
        initializeFlipper(this, reactNativeHost.reactInstanceManager)
    }

    private fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        if (BuildConfig.DEBUG) {
            try {
                val aClass = Class.forName("com.earthidnew.ReactNativeFlipper")
                aClass.getMethod("initializeFlipper", Context::class.java, ReactInstanceManager::class.java)
                    .invoke(null, context, reactInstanceManager)
            } catch (e: ClassNotFoundException) {
                e.printStackTrace()
            } catch (e: NoSuchMethodException) {
                e.printStackTrace()
            } catch (e: IllegalAccessException) {
                e.printStackTrace()
            } catch (e: InvocationTargetException) {
                e.printStackTrace()
            }
        }
    }
}
