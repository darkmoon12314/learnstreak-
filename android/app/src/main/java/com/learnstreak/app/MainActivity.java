package com.learnstreak.app;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onResume() {
        super.onResume();
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            // Disable text selection to make it feel more like a native app
            webView.setOnLongClickListener(v -> true);
            webView.setLongClickable(false);

            // Add CSS to disable user selection and tap highlight
            String css = "body { -webkit-user-select: none; -webkit-tap-highlight-color: transparent; } " +
                         "input, textarea { -webkit-user-select: text; }";
            webView.evaluateJavascript("(function() {" +
                    "var style = document.createElement('style');" +
                    "style.type = 'text/css';" +
                    "style.innerHTML = '" + css + "';" +
                    "document.head.appendChild(style);" +
                    "})();", null);
        }
    }
}