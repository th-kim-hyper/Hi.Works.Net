﻿using BrityWorks.AddIn.Hyper.Properties;
using RPAGO.AddIn;
using System.Drawing;

namespace BrityWorks.AddIn.Hyper.Activities
{
    public class ReceiveMail_v30 : ReceiveMail, IActivityItem
    {
        public new string DisplayName => "Hyper Receive Mail v3.0";
        public new Bitmap Icon => Resources.send_mail;
    }
}