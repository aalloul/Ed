package com.app.ed.android;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


public class ScannedDocumentsList extends Fragment {


    private onScannedDocumentListInteraction mListener;
    private long fragmentStartTime;
    private View view;

    public ScannedDocumentsList() {
        // Required empty public constructor
        fragmentStartTime = Utilities.CurrentTimeMS();
    }


    public static ScannedDocumentsList newInstance() {
        return new ScannedDocumentsList();
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
        view = inflater.inflate(R.layout.fragment_scanned_documents_list, container, false);
        return view;
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof onScannedDocumentListInteraction) {
            mListener = (onScannedDocumentListInteraction) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement onScannedDocumentListInteraction");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    interface onScannedDocumentListInteraction {
        void onRequestProfessionalTranslation();
        void onOpenDocument();
        void onSendDocument();
    }
}
