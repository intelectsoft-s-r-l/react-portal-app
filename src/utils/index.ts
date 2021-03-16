import { message } from "antd";
// @ts-ignore
import { JSEncrypt } from "jsencrypt";
import moment from "moment";
import { ILocale } from "../api/app/types";

class Utils {
  static getNameInitial(name: string) {
    let initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
  }

  static getRouteInfo(navTree: any, path: any): any {
    if (navTree.path === path) {
      return navTree;
    }
    let route;
    for (let p in navTree) {
      if (navTree.hasOwnProperty(p) && typeof navTree[p] === "object") {
        route = this.getRouteInfo(navTree[p], path);
        if (route) {
          return route;
        }
      }
    }
    return route;
  }

  static getColorContrast(hex: any) {
    const threshold = 130;
    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);
    function hexToR(h: any) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h: any) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h: any) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }
    function cutHex(h: any) {
      return h.charAt(0) === "#" ? h.substring(1, 7) : h;
    }
    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "dark";
    } else {
      return "light";
    }
  }

  static shadeColor(color: any, percent: any) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(String((R * (100 + percent)) / 100));
    G = parseInt(String((G * (100 + percent)) / 100));
    B = parseInt(String((B * (100 + percent)) / 100));
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    const RR =
      R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);
    return `#${RR}${GG}${BB}`;
  }

  static getSignNum(number: number, positive: any, negative: any) {
    if (number > 0) {
      return positive;
    }
    if (number < 0) {
      return negative;
    }
    return null;
  }

  static antdTableSorter(a: any, b: any, key: any) {
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      return a[key] - b[key];
    }

    if (typeof a[key] === "string" && typeof b[key] === "string") {
      a = a[key].toLowerCase();
      b = b[key].toLowerCase();
      return a > b ? -1 : b > a ? 1 : 0;
    }
    return;
  }

  static filterArray(list: any, key: any, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item: any) => item[key] === value);
    }
    return data;
  }
  static deleteArrayRow<T>(list: T[], key: keyof T, value: any) {
    let data = list;
    if (list) {
      data = list.filter((item) => item[key] !== value);
    }
    return data;
  }

  static wildCardSearch<T>(list: T[], input: string) {
    list = list.filter((item) => {
      for (let key in item) {
        if (item[key] == null || key === "Photo" || key === "Logo") {
          continue;
        }
        if (
          item[key]
            //@ts-ignore
            .toString()
            .toUpperCase()
            .indexOf(input.toString().toUpperCase()) !== -1
        ) {
          return true;
        }
      }
    });
    return list;
  }

  static getBreakPoint(screens: any) {
    let breakpoints: any[] = [];
    for (const key in screens) {
      if (screens.hasOwnProperty(key)) {
        const element = screens[key];
        if (element) {
          breakpoints.push(key);
        }
      }
    }
    return breakpoints;
  }

  static encryptInput(input: string, publicKey: string) {
    const jsEncrypt = new JSEncrypt({});
    jsEncrypt.setPublicKey(publicKey);
    return jsEncrypt.encrypt(input);
  }

  static getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  static beforeUploadArticle(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (event) {
        const image: any = document.createElement("img");
        image.src = event!.target!.result;
        image.onload = function () {
          const isSquare = image.width === image.height;
          const isJpgOrPng =
            file.type === "image/jpeg" || file.type === "image/png";
          if (!isSquare) {
            message.error("Image must be 1:1 format!");
          }

          if (!isJpgOrPng) {
            message.error("You can only upload JPG/PNG file!");
          }
          if (isSquare && isJpgOrPng) {
            resolve();
          } else {
            reject();
          }
        };
      };
    });
  }

  static beforeUpload(file: any) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 0.3;

    if (!isLt2M) {
      message.error("Image must be smaller than 300kb!");
    }
    return isJpgOrPng && isLt2M;
  }

  static dummyRequest({ onSuccess }: any) {
    setTimeout(() => {
      onSuccess("ok");
    });
  }

  static sortData(array: any, key: any) {
    return array.slice().sort((a: any, b: any) => a[key] - b[key]);
  }

  static handleDotNetDate(date: any) {
    return moment(date).format("[/Date(]xZZ[)/]");
  }

  static fromDotNetDate(date: any) {
    try {
      return moment(new Date(parseInt(date.substr(6)))).format("DD-MM-YYYY");
    } catch {
      return "Unknown date";
    }
  }

  static toMilliSeconds(date: string) {
    const newDate = new Date(date);
    return newDate.getMilliseconds();
  }
  static parseToTicks(date: number): number {
    return date * 10000 + 621355968000000000;
  }

  static decodeBase64Locale(data: ILocale | string) {
    try {
      const str = data.toString();
      return JSON.parse(decodeURIComponent(window.atob(str)));
    } catch {
      return { en: "", ro: "", ru: "" };
    }
  }

  static printElement(elem: any) {
    var mywindow = window.open("", "PRINT", "height=600,width=800");

    mywindow!.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow!.document.write("</head><body >");
    mywindow!.document.write("<h1>" + document.title + "</h1>");
    mywindow!.document.write(
      (document.querySelector(".print-button")!.innerHTML = "")
    );
    mywindow!.document.write(document.querySelector(elem).innerHTML);
    mywindow!.document.write("</body></html>");

    mywindow!.document.close(); // necessary for IE >= 10
    mywindow!.focus(); // necessary for IE >= 10*/

    mywindow!.print();
    mywindow!.close();
  }

  static printElementAlt(elem: any) {
    document.querySelector(elem).style = "padding: 100";
    var printContents = document.querySelector(elem).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    window.location.reload();
  }
}

export default Utils;
