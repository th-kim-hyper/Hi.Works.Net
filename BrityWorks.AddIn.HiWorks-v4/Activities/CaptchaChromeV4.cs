using BrityWorks.AddIn.HiWorks.Properties;
using RPAGO.AddIn;
using RPAGO.Common.Data;
using RPAGO.Common.Library;
using RPAGO.Lib.Chrome;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;

namespace BrityWorks.AddIn.HiWorks.Activities
{
    public class CaptchaChromeV4 : IActivityItem
    {
        public static readonly PropKey OutputPropKey = new PropKey("OUTPUT", "Result");
        public static readonly PropKey ChromeBrowserPropKey = new PropKey("Captcha", "Browser");
        public static readonly PropKey CaptchaTypePropKey = new PropKey("Captcha", "CaptchaType");
        public static readonly PropKey CaptchaImagePropKey = new PropKey("Captcha", "CaptchaImage");
        public static readonly PropKey CaptchaAnswerPropKey = new PropKey("Captcha", "CaptchaAnswer");

        // 카드 이름
        public string DisplayName => "Captcha Chrome v4";

        // 아이콘 설정
        public System.Drawing.Bitmap Icon => Resources.excute;

        public LibraryHeadlessType Mode => LibraryHeadlessType.Both;

        // 아웃풋 설정
        public PropKey DisplayTextProperty => OutputPropKey;
        public PropKey OutputProperty => OutputPropKey;

        // 아래에서 사용될 propertylist 선언
        protected PropertySet PropertyList;
        
        private static Dictionary<string, string> captchaTypeDict = new Dictionary<string, string>()
        {
            {"supreme_court", "대법원"},
            {"gov24", "정부24"},
        };

        private static string defaultCaptchaType = captchaTypeDict.Values.First();
        private static string captchaTypeValues = string.Join(";", captchaTypeDict.Values);

        public List<Property> OnCreateProperties()
        {
            var properties = new List<Property>()
            {
                // 카드의 옵션들에 대한 세부적인 설정 (내용, 들어가는 값 등)
                new Property(this, OutputPropKey, "RESULT").SetRequired(),
                new Property(this, ChromeBrowserPropKey, "LATEST_BROWSER").SetOrder(1).SetRequired(),
                new Property(this, CaptchaTypePropKey, defaultCaptchaType).SetDropDownList(captchaTypeValues).SetOrder(2).SetRequired(),
                new Property(this, CaptchaImagePropKey, ""),
                new Property(this, CaptchaAnswerPropKey, ""),
            };

            return properties;
        }

        public void OnLoad(PropertySet properties)
        {
            PropertyList = properties;
        }

        public object OnRun(IDictionary<string, object> properties)
        {
            try
            {
                string captchaType = properties[CaptchaTypePropKey]?.ToString() ?? "supreme_court";
                captchaType = captchaTypeDict.FirstOrDefault(x => x.Value == captchaType).Key ?? "supreme_court";
                object browserObject = properties[ChromeBrowserPropKey];
                object pageObject = null;

                if (browserObject is PredefinedObject predefinedObject && predefinedObject.Type == PreDefineObjectType.LatestBrowser)
                {
                    pageObject = LastUsedPageManager.GetLastUsedPage();
                }
                else if(browserObject is ChromeBrowserObject chromeBrowserObject && chromeBrowserObject.Page is PuppeteerSharp.Page)
                {
                    pageObject = chromeBrowserObject.Page;
                }

                if (pageObject is PuppeteerSharp.Page page)
                {
                    if (captchaType == "gov24")
                    {
                        return Gov24(page, captchaType);
                    }
                    else if (captchaType == "supreme_court")
                    {
                        return SupremeCourt(page, captchaType);
                    }
                    else
                    {
                        throw new Exception("Invalid Captcha Type");
                    }
                }
                else
                {
                    throw new Exception("Browser or Page Object is Invalid");
                }
            }
            catch (Exception)
            {

                throw;
            }
        }

        private object SupremeCourt(PuppeteerSharp.Page page, string captchaType)
        {
            var result = "";
            var unixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var assemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var savePath = Path.Combine(assemblyLocation, "x64", $"{unixTime}.png");
            var executablePath = Path.Combine(assemblyLocation, "x64", "main.exe");
            var imgSelector = "#mf_ssgoTopMainTab_contents_content1_body_img_captcha";
            var textSelector = "#mf_ssgoTopMainTab_contents_content1_body_ibx_answer";
            var opt = new PuppeteerSharp.WaitForSelectorOptions{Timeout = 3000};
            var frame = page.MainFrame;

            try
            {
                page.WaitForTimeoutAsync(2000).Wait();

                if (!(frame?.ChildFrames?[0] is PuppeteerSharp.Frame document))
                {
                    throw new Exception("Cannot found iframe");
                }

                var imgElement = document.WaitForSelectorAsync(imgSelector, opt).Result;
                var imageSaved = SaveCaptchaImage(imgElement, savePath);

                if (SaveCaptchaImage(imgElement, savePath))
                {
                    var output = PredCaptcha(executablePath, captchaType, savePath);
                    result = output;

                    if (output?.Trim()?.Length > 0)
                    {
                        var textElement = document.QuerySelectorAsync(textSelector).Result as PuppeteerSharp.ElementHandle;
                        var setText = SetCaptchaText(textElement, output);
                    }
                    else
                    {
                        throw new Exception("Captcha Prediction Failed");
                    }

                    return result;
                }
                else
                {
                    throw new Exception("Captcha Element Not Found");
                }
            }
            catch (Exception e)
            {
                throw e.InnerException;
            }
            finally
            {
                if (File.Exists(savePath))
                {
                    File.Delete(savePath);
                }
            }
        }

        private object Gov24(PuppeteerSharp.Page page, string captchaType)
        {
            var result = "";
            var unixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
            var assemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var savePath = Path.Combine(assemblyLocation, "x64", $"{unixTime}.png");
            var executablePath = Path.Combine(assemblyLocation, "x64", "main.exe");
            var imgSelector = "#cimg";
            var textSelector = "#answer";
            var opt = new PuppeteerSharp.WaitForSelectorOptions { Timeout = 3000 };
            var frame = page.MainFrame;

            try
            {
                page.WaitForTimeoutAsync(2000).Wait();

                var document = frame;
                var imgElement = page.WaitForSelectorAsync(imgSelector, opt).Result;
                var imageSaved = SaveCaptchaImage(imgElement, savePath);

                if (SaveCaptchaImage(imgElement, savePath))
                {
                    var output = PredCaptcha(executablePath, captchaType, savePath);
                    result = output;

                    if (output?.Trim()?.Length > 0)
                    {
                        var textElement = page.QuerySelectorAsync(textSelector).Result as PuppeteerSharp.ElementHandle;
                        var setText = SetCaptchaText(textElement, output);
                    }
                    else
                    {
                        throw new Exception("Captcha Prediction Failed");
                    }

                    return result;
                }
                else
                {
                    throw new Exception("Captcha Element Not Found");
                }
            }
            // 오류 발생시 success 를 false로 설정하고, throw로 exception을 던짐.
            catch (Exception e)
            {
                throw e.InnerException;
            }
            finally
            {
                if (File.Exists(savePath))
                {
                    File.Delete(savePath);
                }
            }
        }

        public bool SaveCaptchaImage(PuppeteerSharp.ElementHandle imageElement, string savePath)
        {
            var result = false;

            if (imageElement is PuppeteerSharp.ElementHandle)
            {
                result = imageElement.ScreenshotAsync(savePath).Wait(1000);
            }

            return result;
        }

        public bool SetCaptchaText(PuppeteerSharp.ElementHandle textElement, string answer)
        {
            var result = false;

            if (textElement is PuppeteerSharp.ElementHandle)
            {
                result = textElement.TypeAsync(answer).Wait(1000);
            }

            return result;
        }

        public string PredCaptcha(string executablePath, string captchaType, string imagePath)
        {
            var result = "";
            var arguments = $"-c={captchaType} -i=\"{imagePath}\"";
            var processInfo = new ProcessStartInfo
            {
                FileName = executablePath,
                Arguments = arguments,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using (var process = Process.Start(processInfo))
            {
                if (process is Process)
                {
                    result = process.StandardOutput.ReadToEnd()?.Trim();
                    process.WaitForExit();
                }
                else
                {
                    throw new Exception("Captcha read Failed");
                }
            }

            return result;
        }

    }
}
