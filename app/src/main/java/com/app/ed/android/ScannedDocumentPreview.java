package com.app.ed.android;

import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


public class ScannedDocumentPreview extends Fragment {


    private onScannedDocumentPreviewInteraction mListener;
    private View view;

    public ScannedDocumentPreview() {
        // Required empty public constructor
    }


    // TODO: Rename and change types and number of parameters
    public static ScannedDocumentPreview newInstance() {
        return new ScannedDocumentPreview();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.fragment_scanned_document_preview, container, false);
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof onScannedDocumentPreviewInteraction) {
            mListener = (onScannedDocumentPreviewInteraction) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement onScannedDocumentPreviewInteraction");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    public interface onScannedDocumentPreviewInteraction {
        void onScannedDocumentPreviewOpenDocument();
    }
}
