package com.app.ed.android;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


public class TranslationRequestConfirmation extends Fragment {

    private onTranslationRequestConfirmationInteraction mListener;
    private View view;
    private long fragmentStartTime;

    public TranslationRequestConfirmation() {
        // Required empty public constructor
        fragmentStartTime = Utilities.CurrentTimeMS();

    }


    public static TranslationRequestConfirmation newInstance() {
        return new TranslationRequestConfirmation();
    }

    long getFragmentStartTime() {
        return fragmentStartTime;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_translation_request_confirmation, container, false);
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof onTranslationRequestConfirmationInteraction) {
            mListener = (onTranslationRequestConfirmationInteraction) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement onTranslationRequestConfirmationInteraction");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    interface onTranslationRequestConfirmationInteraction {
        void onRequestAutomaticTranslation();
        void onRequestProfessionalTranslation();
    }
}
