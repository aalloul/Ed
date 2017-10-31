package com.app.ed.android;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import java.util.ArrayList;
import java.util.UUID;


class User {
    private static User userInstance = new User();
    private Context context;
    private String share_pref_file_name = "com.app.ed.android.SharePrefUser";
    private String firstname, surname, email, preferred_language, deviceId, deviceType;
    private int number_prompts, numberScannedDocuments;
    private ArrayList<String> scannedDocumentsList;

    static User getInstance() {
        return userInstance;
    }

    private User() {
        scannedDocumentsList = new ArrayList<>();
    }

    void setContext(Context context) {
        this.context = context;
        loadDetails();
    }

    private void loadDetails() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(share_pref_file_name,
                Context.MODE_PRIVATE);
        setFirstname(sharedPreferences.getString("firstname", null));
        setSurname(sharedPreferences.getString("surname", null));
        setEmail(sharedPreferences.getString("email", null));
        setPreferred_language(sharedPreferences.getString("preferred_language", null));
        setDeviceId(sharedPreferences.getString("deviceId", null));
        setDeviceType(sharedPreferences.getString("deviceType", null));
        setNumber_prompts(sharedPreferences.getInt("number_prompts", 0));
        setNumberScannedDocuments(sharedPreferences.getInt("numberScannedDocuments", 0));

        for (int i=1; i<=getNumberScannedDocuments(); i++ ) {
            addScannedDocumentToList(sharedPreferences.getString("Scanned_"+i, null));
        }

    }

    void addScannedDocumentToList(String path_to_document) {
        scannedDocumentsList.add(path_to_document);
    }

    ArrayList<String> getScannedDocumentsList() {
        return scannedDocumentsList;
    }
    void setNumberScannedDocuments(int integer) {
        numberScannedDocuments = integer;
    }

    void incrementNumberScannerDocuments() {
        numberScannedDocuments++;
    }

    int getNumberScannedDocuments() {return numberScannedDocuments;}

    void setScannedDocumentsList(ArrayList<String> list_paths) {
        scannedDocumentsList = list_paths;
    }
    void saveDetails() {
        SharedPreferences sharedPreferences = context.getSharedPreferences(share_pref_file_name,
                Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("firstname", firstname);
        editor.putString("surname", surname);
        editor.putString("email", email);
        editor.putString("preferred_language", preferred_language);
        editor.putString("deviceId", deviceId);
        editor.putString("deviceType", deviceType);
        editor.putInt("number_prompts", number_prompts+1);
        editor.putInt("numberScannedDocuments", getNumberScannedDocuments());
        int i = 0;
        for (String mypath: getScannedDocumentsList()) {
            i ++;
            editor.putString("Scanned_"+i, mypath);
        }
        editor.apply();
    }

    void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    void setSurname(String surname) {
        this.surname = surname;
    }

    void setPreferred_language(String preferred_language) {
        this.preferred_language = preferred_language;
    }

    private void setDeviceId(String deviceId) {
        if (deviceId == null) {
            this.deviceId = UUID.randomUUID().toString();
        } else {
            this.deviceId = deviceId;
        }
    }

    private void setDeviceType(String deviceType) {
        if (deviceType == null){
            this.deviceType = Build.DEVICE;
        } else {
            this.deviceType = deviceType;
        }
    }

    void setEmail(String email) {
        this.email = email;
    }

    void setNumber_prompts(int number_prompts) {
        this.number_prompts = number_prompts;
    }

    String getFirstname() {
        return firstname;
    }

    String getSurname() {
        return surname;
    }

    String getPreferred_language() {
        return preferred_language;
    }

    String getDeviceId() {
        return deviceId;
    }

    String getDeviceType() {
        return deviceType;
    }

    String getEmail() {
        return email;
    }

    int getNumber_prompts() {
        return number_prompts;
    }
}
