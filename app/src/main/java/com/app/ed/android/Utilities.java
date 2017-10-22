package com.app.ed.android;

import android.support.design.widget.Snackbar;
import android.util.Log;
import android.view.View;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;


final class Utilities {
    final static String LOG_TAG = "Utilities";
    private final static boolean DEBUG =false;

    /**
     * This function converts a String into a date formatted as required by formatString.
     * Check performed:
     *   if year > 2017 && year < 2100 -> date was in milliseconds
     *   else date was in seconds
     * @param epoch the epoch timestamp formatted as a String
     * @param formatString the output format
     * @return formatted string
     */
    static String Epoch2Date(String epoch, String formatString){
        Date updatedate;
        SimpleDateFormat out_format = new SimpleDateFormat(formatString);
        SimpleDateFormat test_format = new SimpleDateFormat("yyyy");
        if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - updatedate = " +epoch);

        long epoch_long = Long.parseLong(epoch);
        if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - parsed(updatedate) = " +epoch_long);

        updatedate = new Date(epoch_long);
        if (Integer.parseInt(test_format.format(updatedate)) > 2016 &&
                Integer.parseInt(test_format.format(updatedate)) < 2100) {
            if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - it's in milli");
            return (out_format.format(updatedate));
        } else {
            if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - it's in seconds");
            return out_format.format(new Date(epoch_long*1000));
        }
    }

    /**
     * Same as above but the input is now a long instead of a String
     * @param epoch Unix epoch in seconds or milliseconds
     * @param formatString output format
     * @return formatted String
     */
    static String Epoch2Date(long epoch, String formatString){
        if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - epoch = " +epoch);
        Date updatedate;
        SimpleDateFormat out_format = new SimpleDateFormat(formatString);
        SimpleDateFormat test_format = new SimpleDateFormat("yyyy");

        updatedate = new Date(epoch);
        if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - updatedate = " +updatedate);
        if (Integer.parseInt(test_format.format(updatedate)) > 2016 &&
                Integer.parseInt(test_format.format(updatedate)) < 2100) {
            if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - it's in milli");
            return (out_format.format(updatedate));
        } else {
            if (DEBUG) Log.i(LOG_TAG, "Epoch2Date - it's in seconds");
            return out_format.format(new Date(epoch*1000));
        }
    }

    static long Date2EpochMillis(String date, String formatString) {
        SimpleDateFormat df = new SimpleDateFormat(formatString);
        try {
            return df.parse(date).getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return 0;
    }

    static String getTomorrow(String format) {
        return Epoch2Date(CurrentTimeMS() + 24*3600*1000, format);
    }

    static String DateToDate(String date, String inputFormat,String outputFormat) {
        SimpleDateFormat input = new SimpleDateFormat(inputFormat);
        SimpleDateFormat output = new SimpleDateFormat(outputFormat);
        String resu = "";
        try {
            resu = output.format(input.parse(date));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return resu;
    }

    // Gets the current time in ms
    static long CurrentTimeMS() {
        return System.currentTimeMillis();
    }

    // The snackbar
    static void makeThesnack(View theview, String the_message, String action_message) {
        final Snackbar snackbar = Snackbar.make(theview, the_message, Snackbar.LENGTH_INDEFINITE);
        snackbar.setAction(action_message, new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                snackbar.dismiss();
            }
        });
        snackbar.show();
    }

    static String generateScanFileName() {
        return "scan_" + Epoch2Date(CurrentTimeMS(), "yyyy-MM-dd HH:mm:ss")+".jpg";
    }


}
