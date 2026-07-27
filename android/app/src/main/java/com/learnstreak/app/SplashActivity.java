package com.learnstreak.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView logo = findViewById(R.id.splash_logo);
        final TextView text = findViewById(R.id.splash_text);

        // Logo Animation: Fade in and Scale
        logo.setAlpha(0f);
        logo.animate()
            .alpha(1f)
            .scaleX(1.1f)
            .scaleY(1.1f)
            .setDuration(1000)
            .withEndAction(new Runnable() {
                @Override
                public void run() {
                    // Text Animation: Slide up and Fade in
                    text.setVisibility(View.VISIBLE);
                    text.setTranslationY(50f);
                    text.setAlpha(0f);
                    text.animate()
                        .translationY(0f)
                        .alpha(1f)
                        .setDuration(800)
                        .start();
                }
            })
            .start();

        // Transition to MainActivity after 3 seconds
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
            }
        }, 3000);
    }
}