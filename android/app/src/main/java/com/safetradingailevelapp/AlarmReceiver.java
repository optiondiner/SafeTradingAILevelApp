package com.safetradingailevelapp;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class AlarmReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        // This will run when the alarm triggers
        Toast.makeText(context, "Alarm Triggered!", Toast.LENGTH_SHORT).show();
    }
}
