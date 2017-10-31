package com.app.ed.android;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.CardView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;


public class TranslationRequestConfirmation extends Fragment {

    private onTranslationRequestConfirmationInteraction mListener;
    private View view;
    private long fragmentStartTime;
    private final static String LOG_TAG = "TranslationRequestConf";

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
        setAutomaticTranslationCard();
        setProfessionalTranslationCard();
        return view;
    }

    private void setAutomaticTranslationCard() {
        ImageView automatic_translation = (ImageView)
                view.findViewById(R.id.confirmation_request_automatic_translation);
        automatic_translation.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Log.i(LOG_TAG,"setAutomaticTranslationCard - OnClick" );
                        mListener.onRequestAutomaticTranslationPressed();
                    }
                }
        );

    }

    private void setProfessionalTranslationCard() {
        CardView automatic_translation = (CardView)
                view.findViewById(R.id.confirmation_request_professional_translation);
        automatic_translation.setOnClickListener(
                new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        mListener.onRequestProfessionalTranslationPressed();
                    }
                }
        );

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
        void onRequestAutomaticTranslationPressed();
        void onRequestProfessionalTranslationPressed();
        User getUserInstanceForTranslationRequestConfirmation();
    }
}
