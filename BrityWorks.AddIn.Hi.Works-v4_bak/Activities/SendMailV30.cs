using BrityWorks.AddIn.Hi.Works.Properties;
using RPAGO.AddIn;
using System.Drawing;

namespace BrityWorks.AddIn.Hi.Works.Activities
{
    public partial class SendMailV30 : SendMail, IActivityItem
    {
        public new string DisplayName => "DisplayName_SendMailV30".GetResource("Hi. Send Mail v3.0");
        public new Bitmap Icon => Resources.send_mail;
    }
}
