package com.app.ed.android;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

public class ExplanationScreen extends Fragment {

    private OnExplanationScreenInteractionListener mListener;
    private View view;
    private long fragmentStartTime;

    public ExplanationScreen() {
        fragmentStartTime = Utilities.CurrentTimeMS();
    }

    static ExplanationScreen newInstance() {
        return new ExplanationScreen();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_explanation_screen, container, false);
        setButton();

        return view;
    }

    void setButton() {
        Button button = (Button) view.findViewById(R.id.explanation_screen_button);
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mListener.onExplanationScreenButtonPressed();
            }
        });
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnExplanationScreenInteractionListener) {
            mListener = (OnExplanationScreenInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnExplanationScreenInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    long getFragmentStartTime() {
        return fragmentStartTime;
    }

    interface OnExplanationScreenInteractionListener {
        void onExplanationScreenButtonPressed();
    }
}
