package com.app.ed.android;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

import java.util.ArrayList;
import java.util.HashMap;

public class MainActivity extends AppCompatActivity implements
        WelcomeScreen.OnExplanationScreenInteractionListener,
        ActivityCompat.OnRequestPermissionsResultCallback,
        ScanDocument.ScanDocumentInterface,
        TranslationRequestConfirmation.onTranslationRequestConfirmationInteraction,
        ScannedDocumentsList.onScannedDocumentListInteraction {

    private User user;
    private ReportingEvent reportingEvent;
    private final static boolean DEBUG = true;
    private final static String LOG_TAG = "MainActivity";

    // Variables to hold the fragments instances
    private WelcomeScreen explanationScreen;
    private ScanDocument scanDocument;
    private TranslationRequestConfirmation translationRequestConfirmation;
    private ScannedDocumentsList scannedDocumentsList;

    private final static int min_number_before_no_explanation=99999;
    static final int REQUEST_CAMERA_PERMISSION=1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Load the User
        user = User.getInstance();
        user.setContext(this.getApplicationContext());

        // Load the Reporting class
        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setActivityName("MainActivity");
        reportingEvent.setDeviceId(user.getDeviceId());
        reportingEvent.setDeviceType(user.getDeviceType());

        if (savedInstanceState == null) {
            if (DEBUG) Log.i(LOG_TAG, "onCreate - savedInstanceState is null");
            FragmentTransaction fmg = getSupportFragmentManager().beginTransaction();
            if (user.getNumber_prompts() > min_number_before_no_explanation) {
                if (DEBUG) Log.i(LOG_TAG, "onCreate - user already registered");
                scanDocument = ScanDocument.newInstance();
                fmg.add(R.id.main_activity, scanDocument, "scanDocument");
            } else {
                if (DEBUG) Log.i(LOG_TAG, "onCreate - user not registered");
                explanationScreen = WelcomeScreen.newInstance();
                fmg.add(R.id.main_activity, explanationScreen, "explanationScreen");
            }
            fmg.commit();
        } else {
            if (DEBUG) Log.i(LOG_TAG, "OnCreate - savedInstanceState not null");
            explanationScreen = (WelcomeScreen)
                    getSupportFragmentManager().findFragmentByTag("explanationScreen");
            scanDocument = (ScanDocument)
                    getSupportFragmentManager().findFragmentByTag("scanDocument");
            translationRequestConfirmation = (TranslationRequestConfirmation)
                    getSupportFragmentManager().findFragmentByTag("translationRequestConfirmation");
            scannedDocumentsList = (ScannedDocumentsList)
                    getSupportFragmentManager().findFragmentByTag("scannedDocumentsList");
        }

        if (DEBUG) Log.i(LOG_TAG, "onCreate - Exit");
    }

    @Override
    public void onResume() {
        super.onResume();

        if (DEBUG) Log.i(LOG_TAG, "onResume - enter");

        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setActivityName("MainActivity");
        reportingEvent.setFragmentName(getVisibleFragment());
        reportingEvent.setFragmentStart(getFragmentStartTime());
        reportingEvent.addEvent("Action", "onResume");
        reportingEvent.setend_session(true);

    }

    private String getVisibleFragment() {
        if (scanDocument != null && scanDocument.isVisible()) {
            return "scanDocument";
        }

        if (explanationScreen != null && explanationScreen.isVisible()) {
            return "explanationScreen";
        }

        if (translationRequestConfirmation != null && translationRequestConfirmation.isVisible()) {
            return "translationRequestConfirmation";
        }

        if (scannedDocumentsList != null && scannedDocumentsList.isVisible()) {
            return "scannedDocumentsList";
        }

        return "Unknown";
    }

    private long getFragmentStartTime() {
        if (explanationScreen != null && explanationScreen.isVisible()) {
            return explanationScreen.getFragmentStartTime();
        }

        if (scanDocument != null && scanDocument.isVisible()) {
            return scanDocument.getFragmentStartTime();
        }

        if (translationRequestConfirmation != null && translationRequestConfirmation.isVisible()) {
            return translationRequestConfirmation.getFragmentStartTime();
        }

        if (scannedDocumentsList != null && scannedDocumentsList.isVisible()) {
            return scannedDocumentsList.getFragmentStartTime();
        }

        return Utilities.CurrentTimeMS();
    }

    @Override
    public void onStart() {
        if (DEBUG) Log.i(LOG_TAG, "onStart - Enter");

        super.onStart();

        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setActivityName("MainActivity");
        reportingEvent.setFragmentName(getVisibleFragment());
        reportingEvent.setFragmentStart(getFragmentStartTime());
        reportingEvent.addEvent("Action", "onStart");
        reportingEvent.setend_session(true);

        if (DEBUG) Log.i(LOG_TAG, "onStart - Exit");
    }

    @Override
    public void onStop() {
        Log.i(LOG_TAG, "onStop - Enter");
        user.saveDetails();

        super.onStop();

        Log.i(LOG_TAG, "onStop - Number Events = " + reportingEvent.getNumberEvents());
        Log.i(LOG_TAG, "onStop - Content Events = " + reportingEvent.getEvents());

        if (reportingEvent != null && reportingEvent.end_session() &&
                reportingEvent.getNumberEvents() > 0) {
            reportingEvent.setFragmentEnd();
            reportingEvent.setSessionEnd();
            reportingEvent.addEvent("Action","onStop", "ReasonForReporting", "SessionEnd",
                    "NumberEvents", reportingEvent.getNumberEvents()+1);
            ArrayList<HashMap<String, Object>> thedata = reportingEvent.getEvents();
            reportingEvent.clearEvents();
//            postUsageRequest(thedata);
        }

        // Cancel the volley requests
//        if (volleyQueue != null) {
//            volleyQueue.cancelAll("searchTAG");
//            volleyQueue.cancelAll("postTAG");
//        }
        if (DEBUG) Log.i(LOG_TAG, "onStop - Exit");
    }

    @Override
    @SuppressWarnings("unchecked")
    public void onPause() {
        Log.i(LOG_TAG, "onPause - Enter");
        user.saveDetails();

        super.onPause();

        reportingEvent.setFragmentName(getVisibleFragment());

        if (reportingEvent.end_session()){
            reportingEvent.setFragmentEnd();
            reportingEvent.setSessionEnd();
            reportingEvent.addEvent("Action","onPause", "ReasonForReporting", "SessionEnd",
                    "NumberEvents", reportingEvent.getNumberEvents()+1);
            ArrayList<HashMap<String, Object>>  thedata = reportingEvent.getEvents();
            reportingEvent.clearEvents();
//            postUsageRequest(thedata);
            return;
        }

        if (reportingEvent.getNumberEvents() > 20){
            reportingEvent.setFragmentEnd();
            reportingEvent.addEvent("Action","onPause", "ReasonForReporting", "ReachedEventLimit",
                    "NumberEvents", reportingEvent.getNumberEvents()+1);
            ArrayList<HashMap<String, Object>>  thedata = reportingEvent.getEvents();
            reportingEvent.clearEvents();
//            postUsageRequest(thedata);
        } else {
            reportingEvent.addEvent("Action","onPause");
        }



        if (DEBUG) Log.i(LOG_TAG, "onPause - Exit");
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void onSaveInstanceState(Bundle outState) {

        //Save the fragment's instance
        if (explanationScreen != null && explanationScreen.isAdded()) {
            getSupportFragmentManager().putFragment(outState, "explanationScreen", explanationScreen);
        }

        if (scanDocument != null && scanDocument.isAdded()) {
            getSupportFragmentManager().putFragment(outState, "scanDocument", scanDocument);
        }

        if (translationRequestConfirmation != null && translationRequestConfirmation.isAdded()) {
            getSupportFragmentManager().putFragment(outState, "translationRequestConfirmation", translationRequestConfirmation);
        }

        if (scannedDocumentsList != null && scannedDocumentsList.isAdded()) {
            getSupportFragmentManager().putFragment(outState, "scannedDocumentsList", scannedDocumentsList);
        }

        super.onSaveInstanceState(outState);
    }

    @Override
    public void onExplanationScreenButtonPressed() {

        // Create report
        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setFragmentName("explanationScreen");
        reportingEvent.setFragmentStart(explanationScreen.getFragmentStartTime());
        reportingEvent.addEvent("Action","dismissExplanationScreen",
                "n_prompts", user.getNumber_prompts());

        if (scanDocument == null) {
            scanDocument = ScanDocument.newInstance();
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.main_activity, scanDocument, "scanDocument")
                .addToBackStack(null)
                .commit();
    }

//    @Override
//    public void onScanDocumentButtonPressed() {
//
//    }

    private void requestCameraPermission() {
        if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                Manifest.permission.CAMERA)) {
            FragmentManager fmg = getSupportFragmentManager();

            new ConfirmationDialog().show(fmg, "scanDocument");
        } else {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == REQUEST_CAMERA_PERMISSION) {
            if (grantResults.length != 1 || grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                //TODO improve the ErrorDialog here
//                ErrorDialog.newInstance(getString(R.string.request_permission))
//                        .show()
//                        .show(getChildFragmentManager(), "dialog");
            }
        } else {
            super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
    }

    @Override
    public boolean hasCameraPermission() {
        // Check camera permission
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            requestCameraPermission();
            return false;
        }
        return true;
    }

    @Override
    public void goToScannedDocuments() {
        // Create report
        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setFragmentName("scannedDocuments");
        reportingEvent.setFragmentStart(scanDocument.getFragmentStartTime());
        reportingEvent.addEvent("Action","goToScannedDocumentList");

        if (scannedDocumentsList == null) {
            scannedDocumentsList = ScannedDocumentsList.newInstance();
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.main_activity, scannedDocumentsList, "scannedDocumentsList")
                .addToBackStack(null)
                .commit();
    }

    @Override
    public void cameraApiIncompatibility(String errorMessage) {
        // TODO better handle ErrorDialog
//        ErrorDialog.newInstance(errorMessage)
//                .show(getChildFragmentManager(), FRAGMENT_DIALOG);
    }

    @Override
    public void scanSuccessful(String filename) {
        Log.i(LOG_TAG, "scanSuccessful - file name = "+filename);
        // Create report
        reportingEvent = ReportingEvent.getInstance();
        reportingEvent.setFragmentName("scanDocument");
        reportingEvent.setFragmentStart(scanDocument.getFragmentStartTime());
        reportingEvent.addEvent("Action","takePicture");

        if (translationRequestConfirmation == null) {
            translationRequestConfirmation = TranslationRequestConfirmation.newInstance();
        }

        getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.main_activity, translationRequestConfirmation, "translationRequestConfirmation")
                .addToBackStack(null)
                .commit();
    }

    @Override
    public void onRequestAutomaticTranslation() {

    }

    @Override
    public void onRequestProfessionalTranslation() {

    }

    @Override
    public void onOpenDocument() {

    }

    @Override
    public void onSendDocument() {

    }

    /**
     * Shows OK/Cancel confirmation dialog about camera permission.
     */
    public static class ConfirmationDialog extends DialogFragment {

        @NonNull
        @Override
        public Dialog onCreateDialog(Bundle savedInstanceState) {
            return new AlertDialog.Builder(getActivity())
                    .setMessage(R.string.request_permission)
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            requestPermissions(new String[]{Manifest.permission.CAMERA},
                                    REQUEST_CAMERA_PERMISSION);
                        }
                    })
                    .setNegativeButton(android.R.string.cancel,
                            new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    // Handle negativity
                                }
                            })
                    .create();
        }
    }

    /**
     * Shows an error message dialog.
     */
    public static class ErrorDialog extends DialogFragment {

        private static final String ARG_MESSAGE = "message";

        public static ErrorDialog newInstance(String message) {
            ErrorDialog dialog = new ErrorDialog();
            Bundle args = new Bundle();
            args.putString(ARG_MESSAGE, message);
            dialog.setArguments(args);
            return dialog;
        }

        @NonNull
        @Override
        public Dialog onCreateDialog(Bundle savedInstanceState) {
            final Activity activity = getActivity();
            return new AlertDialog.Builder(activity)
                    .setMessage(getArguments().getString(ARG_MESSAGE))
                    .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            activity.finish();
                        }
                    })
                    .create();
        }

    }
}
