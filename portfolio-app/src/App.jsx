// src/App.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { supabase } from "./supabase";

// ─── DATA ────────────────────────────────────────────────────────────────────
const POSICIONES_ABIERTAS = [
  {ticker:"OTS2D",tipo:"ON",qty:3613,precio_prom:0.9863,capital:17050.22,comisiones:0,precio_actual:1.01,resultado_realizado:429.23,resultado_latente:85.62,intereses:852.11,resultado_total:1366.96,rendimiento:0.0802},
  {ticker:"IRCLD",tipo:"ON",qty:9982,precio_prom:0.9930,capital:46255.38,comisiones:0,precio_actual:1.01,resultado_realizado:301.65,resultado_latente:169.60,intereses:589.93,resultado_total:1061.18,rendimiento:0.0229},
  {ticker:"CP36D",tipo:"ON",qty:27363,precio_prom:0.9736,capital:36676.25,comisiones:10.6,precio_actual:0.86,resultado_realizado:272.49,resultado_latente:-3107.56,intereses:1311.39,resultado_total:-1523.68,rendimiento:-0.0415},
  {ticker:"OTS3D",tipo:"ON",qty:27000,precio_prom:1.0008,capital:32026.08,comisiones:10.08,precio_actual:1.01,resultado_realizado:-4.08,resultado_latente:248.00,intereses:2538.12,resultado_total:2782.04,rendimiento:0.0869},
  {ticker:"ZPC3O",tipo:"ON",qty:5000,precio_prom:1.0201,capital:5100.38,comisiones:25.38,precio_actual:1.0058,resultado_realizado:0,resultado_latente:-71.27,intereses:0,resultado_total:-71.27,rendimiento:-0.0140},
  {ticker:"PQCSO",tipo:"ON",qty:23047,precio_prom:0.9943,capital:30834.41,comisiones:153.79,precio_actual:0.9943,resultado_realizado:99.52,resultado_latente:0,intereses:1206.55,resultado_total:1306.07,rendimiento:0.0424},
  {ticker:"RUCAO",tipo:"ON",qty:10000,precio_prom:1.0151,capital:10150.5,comisiones:50.5,precio_actual:1.0151,resultado_realizado:0,resultado_latente:0.5,intereses:0,resultado_total:0.5,rendimiento:0.00005},
  {ticker:"IRCNO",tipo:"ON",qty:773,precio_prom:1.0150,capital:1799.68,comisiones:8.95,precio_actual:1.0150,resultado_realizado:-9.11,resultado_latente:0,intereses:51.21,resultado_total:42.10,rendimiento:0.0234},
  {ticker:"DNC3O",tipo:"ON",qty:9548,precio_prom:1.0346,capital:9878.82,comisiones:49.15,precio_actual:1.0346,resultado_realizado:0,resultado_latente:0,intereses:0,resultado_total:0,rendimiento:0},
  {ticker:"CWC6O",tipo:"ON",qty:10337,precio_prom:0.9906,capital:10239.79,comisiones:46.36,precio_actual:null,resultado_realizado:0,resultado_latente:0,intereses:0,resultado_total:0,rendimiento:0},
  {ticker:"TLCUD",tipo:"ON",qty:7000,precio_prom:1.0,capital:7000,comisiones:0,precio_actual:null,resultado_realizado:0,resultado_latente:0,intereses:0,resultado_total:0,rendimiento:0},
  {ticker:"EAC3O",tipo:"ON",qty:5000,precio_prom:0.9697,capital:4872.74,comisiones:24.24,precio_actual:0.9697,resultado_realizado:0,resultado_latente:0,intereses:0,resultado_total:0,rendimiento:0},
  {ticker:"ANF",tipo:"Acción",qty:28,precio_prom:91,capital:2560.74,comisiones:12.74,precio_actual:91,resultado_realizado:0,resultado_latente:0,intereses:0,resultado_total:0,rendimiento:0},
];
const POSICIONES_CERRADAS = [{"ticker":"CAC8D","tipo":"Obligación Negociable","qty_comprada":11800,"capital":11800.0,"resultado_realizado":200.0,"intereses":23.2,"comisiones":0.0,"resultado_total":223.2,"rendimiento":0.018915},{"ticker":"YMCVD","tipo":"Obligación Negociable","qty_comprada":20833,"capital":19999.68,"resultado_realizado":833.32,"intereses":0.0,"comisiones":0.0,"resultado_total":833.32,"rendimiento":0.041667},{"ticker":"GD35D","tipo":"Bono","qty_comprada":72448,"capital":34899.598,"resultado_realizado":1279.156991,"intereses":0.0,"comisiones":0.0,"resultado_total":1279.156991,"rendimiento":0.036652},{"ticker":"TLC1D","tipo":"Obligación Negociable","qty_comprada":20000,"capital":20440.0,"resultado_realizado":270.0,"intereses":0.0,"comisiones":0.0,"resultado_total":270.0,"rendimiento":0.013209},{"ticker":"IRCFD","tipo":"Obligación Negociable","qty_comprada":14079,"capital":12682.764,"resultado_realizado":-1234.835602,"intereses":1662.43,"comisiones":1.93,"resultado_total":427.594398,"rendimiento":0.033715},{"ticker":"TX26","tipo":"Bono","qty_comprada":1933,"capital":1933.125645,"resultado_realizado":0.114356,"intereses":0.0,"comisiones":0.0,"resultado_total":0.114356,"rendimiento":5.9e-05},{"ticker":"RCCMD","tipo":"Obligación Negociable","qty_comprada":10000,"capital":10000.0,"resultado_realizado":0.0,"intereses":0.0,"comisiones":0.0,"resultado_total":0.0,"rendimiento":0.0},{"ticker":"DNC2D","tipo":"Obligación Negociable","qty_comprada":19430,"capital":20206.82,"resultado_realizado":289.88,"intereses":0.0,"comisiones":0.02,"resultado_total":289.88,"rendimiento":0.014346},{"ticker":"GD41D","tipo":"Bono","qty_comprada":115441,"capital":50599.707,"resultado_realizado":1922.199002,"intereses":0.0,"comisiones":0.03,"resultado_total":1922.199002,"rendimiento":0.037988},{"ticker":"VSCOD","tipo":"Obligación Negociable","qty_comprada":280,"capital":291.2,"resultado_realizado":2.8,"intereses":0.0,"comisiones":0.0,"resultado_total":2.8,"rendimiento":0.009615},{"ticker":"YMCQD","tipo":"Obligación Negociable","qty_comprada":43393,"capital":42999.39264,"resultado_realizado":471.412363,"intereses":0.0,"comisiones":0.0,"resultado_total":471.412363,"rendimiento":0.010963},{"ticker":"YMCJD","tipo":"Obligación Negociable","qty_comprada":52445,"capital":51571.1336,"resultado_realizado":541.1264,"intereses":1809.02,"comisiones":24.31,"resultado_total":2350.1464,"rendimiento":0.045571},{"ticker":"CRCJD","tipo":"Obligación Negociable","qty_comprada":10204,"capital":9999.92,"resultado_realizado":204.08,"intereses":0.0,"comisiones":0.0,"resultado_total":204.08,"rendimiento":0.020408},{"ticker":"BPD7D","tipo":"Obligación Negociable","qty_comprada":19715,"capital":16298.6242,"resultado_realizado":212.6883,"intereses":0.0,"comisiones":0.0,"resultado_total":212.6883,"rendimiento":0.013049},{"ticker":"AL30D","tipo":"Bono","qty_comprada":97646,"capital":57550.21338,"resultado_realizado":1813.671044,"intereses":119.79,"comisiones":95.7,"resultado_total":1933.461044,"rendimiento":0.033596},{"ticker":"MGCED","tipo":"Obligación Negociable","qty_comprada":21020,"capital":14714.0,"resultado_realizado":630.6,"intereses":0.0,"comisiones":0.0,"resultado_total":630.6,"rendimiento":0.042857},{"ticker":"YMCOD","tipo":"Obligación Negociable","qty_comprada":274,"capital":211.802,"resultado_realizado":10.138,"intereses":0.0,"comisiones":0.0,"resultado_total":10.138,"rendimiento":0.047865},{"ticker":"LOC2D","tipo":"Obligación Negociable","qty_comprada":45900,"capital":46004.36,"resultado_realizado":1242.915,"intereses":214.47,"comisiones":0.01,"resultado_total":1457.385,"rendimiento":0.031679},{"ticker":"GD29D","tipo":"Bono","qty_comprada":6736,"capital":4897.072,"resultado_realizado":124.67336,"intereses":0.0,"comisiones":0.01,"resultado_total":124.67336,"rendimiento":0.025459},{"ticker":"RCCJD","tipo":"Obligación Negociable","qty_comprada":18181,"capital":19999.1,"resultado_realizado":-3080.788,"intereses":3335.88,"comisiones":0.0,"resultado_total":255.092,"rendimiento":0.012755},{"ticker":"Pfizer","tipo":"Acción","qty_comprada":735,"capital":4998.0,"resultado_realizado":301.9968,"intereses":153.87,"comisiones":0.0,"resultado_total":455.8668,"rendimiento":0.09121},{"ticker":"Mcdonalds","tipo":"Acción","qty_comprada":393,"capital":4991.1,"resultado_realizado":88.900019,"intereses":75.24,"comisiones":0.0,"resultado_total":164.140019,"rendimiento":0.032887},{"ticker":"LMS9D","tipo":"Obligación Negociable","qty_comprada":33532,"capital":34292.967,"resultado_realizado":950.4115,"intereses":0.0,"comisiones":0.0,"resultado_total":950.4115,"rendimiento":0.027714},{"ticker":"GD46D","tipo":"Bono","qty_comprada":25210,"capital":14999.95,"resultado_realizado":287.394,"intereses":0.0,"comisiones":0.0,"resultado_total":287.394,"rendimiento":0.01916},{"ticker":"MGCND","tipo":"Obligación Negociable","qty_comprada":13000,"capital":13000.0,"resultado_realizado":277.963,"intereses":0.0,"comisiones":0.0,"resultado_total":277.963,"rendimiento":0.021382},{"ticker":"IRCGD","tipo":"Obligación Negociable","qty_comprada":35300,"capital":35815.365,"resultado_realizado":211.813,"intereses":164.91,"comisiones":0.0,"resultado_total":376.723,"rendimiento":0.010518},{"ticker":"SNS8D","tipo":"Obligación Negociable","qty_comprada":10000,"capital":10000.0,"resultado_realizado":210.411,"intereses":0.0,"comisiones":0.0,"resultado_total":210.411,"rendimiento":0.021041},{"ticker":"GD38D","tipo":"Bono","qty_comprada":23809,"capital":14999.67,"resultado_realizado":238.09,"intereses":0.0,"comisiones":0.0,"resultado_total":238.09,"rendimiento":0.015873},{"ticker":"HJCFD","tipo":"Obligación Negociable","qty_comprada":20000,"capital":20000.0,"resultado_realizado":90.5325,"intereses":861.53,"comisiones":33.0,"resultado_total":952.0625,"rendimiento":0.047603},{"ticker":"YMCYD","tipo":"Obligación Negociable","qty_comprada":25000,"capital":25000.0,"resultado_realizado":300.0,"intereses":0.0,"comisiones":0.0,"resultado_total":300.0,"rendimiento":0.012},{"ticker":"Minera","tipo":"Obligación Negociable","qty_comprada":14908,"capital":14908.0,"resultado_realizado":298.16,"intereses":0.0,"comisiones":0.0,"resultado_total":298.16,"rendimiento":0.02},{"ticker":"OT42D","tipo":"Obligación Negociable","qty_comprada":10000,"capital":10000.0,"resultado_realizado":400.0,"intereses":0.0,"comisiones":0.0,"resultado_total":400.0,"rendimiento":0.04},{"ticker":"IRCND","tipo":"Obligación Negociable","qty_comprada":9000,"capital":8818.88,"resultado_realizado":136.12,"intereses":0.0,"comisiones":88.88,"resultado_total":136.12,"rendimiento":0.015435},{"ticker":"TN63D","tipo":"Obligación Negociable","qty_comprada":20000,"capital":20000.0,"resultado_realizado":542.27,"intereses":0.0,"comisiones":0.0,"resultado_total":542.27,"rendimiento":0.027113},{"ticker":"VSCTD","tipo":"Obligación Negociable","qty_comprada":10000,"capital":9995.0,"resultado_realizado":580.0,"intereses":375.53,"comisiones":0.0,"resultado_total":955.53,"rendimiento":0.095601},{"ticker":"VSCLD","tipo":"Obligación Negociable","qty_comprada":181,"capital":183.72,"resultado_realizado":-1.69735,"intereses":2.04,"comisiones":0.91,"resultado_total":0.34265,"rendimiento":0.001865},{"ticker":"PECAD","tipo":"Obligación Negociable","qty_comprada":305,"capital":282.0,"resultado_realizado":-96.88,"intereses":12.6,"comisiones":2.33,"resultado_total":-84.28,"rendimiento":-0.298865},{"ticker":"AL29D","tipo":"Bono","qty_comprada":25885,"capital":15123.3781,"resultado_realizado":99.511699,"intereses":728.34,"comisiones":46.27,"resultado_total":827.851699,"rendimiento":0.05474},{"ticker":"DNC5D","tipo":"Obligación Negociable","qty_comprada":44163,"capital":44232.02758,"resultado_realizado":2007.670418,"intereses":0.0,"comisiones":452.45,"resultado_total":2007.670418,"rendimiento":0.04539},{"ticker":"IRCPO","tipo":"Obligación Negociable","qty_comprada":10104,"capital":10304.10002,"resultado_realizado":395.895984,"intereses":0.0,"comisiones":51.45,"resultado_total":395.895984,"rendimiento":0.038421},{"ticker":"VSCVO CCL","tipo":"Obligación Negociable","qty_comprada":12000,"capital":12209.06,"resultado_realizado":471.22,"intereses":0.0,"comisiones":63.72,"resultado_total":471.22,"rendimiento":0.038596},{"ticker":"TLCPO","tipo":"Obligación Negociable","qty_comprada":15451,"capital":15936.634,"resultado_realizado":951.565946,"intereses":0.0,"comisiones":164.0,"resultado_total":951.565946,"rendimiento":0.059709},{"ticker":"LDCGO","tipo":"Obligación Negociable","qty_comprada":2574,"capital":2470.46,"resultado_realizado":65.06,"intereses":45.25,"comisiones":25.03,"resultado_total":110.31,"rendimiento":0.044652},{"ticker":"DNC7O","tipo":"Obligación Negociable","qty_comprada":15000,"capital":15527.25,"resultado_realizado":711.345,"intereses":0.0,"comisiones":158.85,"resultado_total":711.345,"rendimiento":0.045813},{"ticker":"AE38","tipo":"Bono","qty_comprada":522,"capital":390.6734,"resultado_realizado":15.5428,"intereses":0.0,"comisiones":3.98,"resultado_total":15.5428,"rendimiento":0.039785},{"ticker":"COIN","tipo":"Acción","qty_comprada":1289,"capital":7902.21,"resultado_realizado":498.53,"intereses":0.0,"comisiones":81.52,"resultado_total":498.53,"rendimiento":0.063087},{"ticker":"IBIT","tipo":"Acción","qty_comprada":4937,"capital":19245.32,"resultado_realizado":1547.155,"intereses":0.0,"comisiones":200.23,"resultado_total":1547.155,"rendimiento":0.080391}];
const MOVIMIENTOS_HISTORICOS = [{"fecha":"2024-01-04","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2025.1,"comision":0,"monto_neto":2025.1,"cuenta":"Galicia","comentario":null},{"fecha":"2024-01-04","ticker":"CAC8D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":1800.0,"precio":1.0,"comision":0,"monto_neto":-1800.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-05-03","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":1300.0,"comision":0,"monto_neto":1300.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-05-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":219.86,"comision":0,"monto_neto":-219.86,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-05-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1299.79,"comision":0,"monto_neto":-1299.79,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-05-20","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":8200.0,"comision":0,"monto_neto":8200.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-05-22","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":14021.0,"precio":0.5846,"comision":0,"monto_neto":-8196.6766,"cuenta":"Galicia","comentario":null},{"fecha":"2024-05-31","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1999.46,"comision":0,"monto_neto":-1999.46,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-05-31","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":40000.0,"comision":0,"monto_neto":40000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-06-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":199.59,"comision":0,"monto_neto":-199.59,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-06-06","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":15961.0,"precio":0.626519,"comision":0,"monto_neto":-9999.869759,"cuenta":"Galicia","comentario":null},{"fecha":"2024-06-10","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20000.0,"precio":1.0,"comision":0,"monto_neto":-20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-06-28","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1808.95,"comision":0,"monto_neto":-1808.95,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-07-01","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":499.76,"comision":0,"monto_neto":-499.76,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-07-10","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Cupón / interés","cantidad":null,"precio":119.79,"comision":0,"monto_neto":119.79,"cuenta":"Galicia","comentario":null},{"fecha":"2024-07-11","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Venta parcial","cantidad":1315.12,"precio":1.0,"comision":0,"monto_neto":1315.12,"cuenta":"Galicia","comentario":null},{"fecha":"2024-07-15","ticker":"GD35D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":16707.0,"precio":0.413,"comision":0,"monto_neto":-6899.991,"cuenta":"Galicia","comentario":null},{"fecha":"2024-07-29","ticker":"CAC8D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":23.2,"comision":0,"monto_neto":23.2,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-06","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":20000.0,"comision":0,"monto_neto":20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-07","ticker":"YMCVD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20833.0,"precio":0.96,"comision":0,"monto_neto":-19999.68,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-12","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":20000.0,"comision":0,"monto_neto":20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-13","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20100.0,"precio":0.995,"comision":0,"monto_neto":-19999.5,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-22","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":20000.0,"comision":0,"monto_neto":20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-28","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":20000.0,"precio":0.99001,"comision":0,"monto_neto":19800.2,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":859.58,"comision":0,"monto_neto":-859.58,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-08-29","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":15000.0,"precio":1.0,"comision":0,"monto_neto":-15000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-08-30","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":16281.0,"precio":0.98,"comision":0,"monto_neto":-15955.38,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-03","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":14598.0,"precio":0.5479,"comision":0,"monto_neto":-7998.239821,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-04","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":35100.0,"precio":1.03,"comision":0,"monto_neto":36153.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-06","ticker":"GD35D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":32894.0,"precio":0.456,"comision":0,"monto_neto":-14999.664,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-06","ticker":"TLC1D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20000.0,"precio":1.022,"comision":0,"monto_neto":-20440.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-09","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.9,"comision":0,"monto_neto":-999.9,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-09-09","ticker":"YMCVD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":20833.0,"precio":1.0,"comision":0,"monto_neto":20833.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-09","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":7442.0,"precio":0.898,"comision":0,"monto_neto":-6682.916,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-09","ticker":"CRCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10204.0,"precio":0.98,"comision":0,"monto_neto":-9999.92,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-09","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":43264.88,"precio":0.604301,"comision":0,"monto_neto":26145.03002,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-10","ticker":"CAC8D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1800.0,"precio":1.0,"comision":0,"monto_neto":1800.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-10","ticker":"GD35D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":49601.0,"precio":0.459935,"comision":0,"monto_neto":22813.25999,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-10","ticker":"TX26","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":1933.0,"precio":1.000065,"comision":0,"monto_neto":-1933.125645,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-10","ticker":"RCCMD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-10","ticker":"DNC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":19230.0,"precio":1.04,"comision":0.02,"monto_neto":-19999.22,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-11","ticker":"TLC1D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":20000.0,"precio":1.0355,"comision":0,"monto_neto":20710.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-11","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":38517.0,"precio":0.431,"comision":0,"monto_neto":-16600.827,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-11","ticker":"VSCOD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":280.0,"precio":1.04,"comision":0,"monto_neto":-291.2,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":20000.0,"comision":0,"monto_neto":20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":7442.0,"precio":0.906,"comision":0,"monto_neto":6742.449998,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":16281.0,"precio":1.0145,"comision":0,"monto_neto":16517.06994,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"TX26","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":1933.0,"precio":1.000124,"comision":0,"monto_neto":1933.240001,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"RCCMD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":23255.0,"precio":0.43,"comision":0,"monto_neto":-9999.65,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":34722.0,"precio":0.432,"comision":0,"monto_neto":-14999.90001,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20408.0,"precio":0.98,"comision":0,"monto_neto":-19999.84,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-12","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":3476.0,"precio":0.556168,"comision":0,"monto_neto":-1933.239999,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-13","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":14285.0,"precio":0.98,"comision":0,"monto_neto":-13999.3,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-13","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":3476.0,"precio":0.559399,"comision":0.01,"monto_neto":1944.459999,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-13","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":17841.0,"precio":1.025,"comision":0,"monto_neto":-18287.025,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-14","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":96494.0,"precio":0.4475,"comision":0.03,"monto_neto":43181.035,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-14","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":40363.0,"precio":0.990999,"comision":0,"monto_neto":-39999.69264,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-18","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":40281.0,"precio":1.0,"comision":0,"monto_neto":40281.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-18","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":17841.0,"precio":1.0495,"comision":0,"monto_neto":18724.1295,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-18","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":5339.0,"precio":1.025,"comision":0,"monto_neto":-5472.475,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"DNC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":19230.0,"precio":1.055,"comision":0,"monto_neto":20287.65,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"VSCOD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":280.0,"precio":1.05,"comision":0,"monto_neto":294.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":82.0,"precio":0.995,"comision":0,"monto_neto":81.59,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":34668.0,"precio":0.5769,"comision":0,"monto_neto":-19999.9692,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":452.0,"precio":1.03,"comision":0,"monto_neto":-465.56,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-19","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":6866.0,"precio":1.019,"comision":0,"monto_neto":-6996.454,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-20","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":180.0,"precio":0.99,"comision":0,"monto_neto":-178.2,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-20","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":52.0,"precio":1.0185,"comision":0,"monto_neto":-52.962,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-20","ticker":"CRCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10204.0,"precio":1.0,"comision":0,"monto_neto":10204.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-23","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":1404.17,"comision":0,"monto_neto":1404.17,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-09-23","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":1981.0,"precio":1.035,"comision":0,"monto_neto":-2050.335,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-23","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":8682.0,"precio":1.019,"comision":0,"monto_neto":-8846.958,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-24","ticker":"DNC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":200.0,"precio":1.038,"comision":0,"monto_neto":-207.6,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-24","ticker":"BPD7D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":18137.0,"precio":0.827,"comision":0,"monto_neto":-14999.299,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-24","ticker":"BPD7D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":1578.0,"precio":0.8234,"comision":0,"monto_neto":-1299.3252,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-24","ticker":"MGCED","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":21020.0,"precio":0.7,"comision":0,"monto_neto":-14714.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-25","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":7450.0,"precio":1.023,"comision":0.01,"monto_neto":-7621.36,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-26","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":15120.0,"precio":0.992,"comision":0,"monto_neto":-14999.04,"cuenta":"Galicia","comentario":null},{"fecha":"2024-09-30","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1000.42,"comision":0,"monto_neto":-1000.42,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-09-30","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1981.0,"precio":1.05,"comision":0,"monto_neto":2080.05,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-01","ticker":"DNC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":200.0,"precio":1.04525,"comision":0,"monto_neto":209.05,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-01","ticker":"MGCED","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":836.0,"precio":0.73,"comision":0,"monto_neto":610.28,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-01","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":504.0,"precio":1.035,"comision":0,"monto_neto":521.64,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-01","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":34668.0,"precio":0.584,"comision":0,"monto_neto":20246.112,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-02","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":899.65,"comision":0,"monto_neto":-899.65,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-10-02","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":18947.0,"precio":0.474974,"comision":0,"monto_neto":-8999.329991,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-02","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":100.0,"precio":1.025,"comision":0,"monto_neto":-102.5,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.91,"comision":0,"monto_neto":-999.91,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-10-03","ticker":"MGCED","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":16976.0,"precio":0.73,"comision":0,"monto_neto":12392.48,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-04","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":1723.5,"comision":0,"monto_neto":1723.5,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-04","ticker":"BPD7D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":19715.0,"precio":0.8375,"comision":0,"monto_neto":16511.3125,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-04","ticker":"MGCED","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":201.0,"precio":0.73,"comision":0,"monto_neto":146.73,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-04","ticker":"MGCND","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":13000.0,"precio":1.0,"comision":0,"monto_neto":-13000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-07","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.97,"comision":0,"monto_neto":-999.97,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-10-07","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":20203.0,"precio":0.99,"comision":0,"monto_neto":20000.97,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-07","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":18181.0,"precio":1.1,"comision":0,"monto_neto":-19999.1,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-07","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":100.0,"precio":1.039,"comision":0,"monto_neto":103.9,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-08","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1399.89,"comision":0,"monto_neto":-1399.89,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-10-08","ticker":"GD41D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":18947.0,"precio":0.493,"comision":0,"monto_neto":9340.871,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-08","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":29790.0,"precio":0.995,"comision":0,"monto_neto":29641.05,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-08","ticker":"YMCOD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":274.0,"precio":0.773,"comision":0,"monto_neto":-211.802,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-08","ticker":"MGCED","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3007.0,"precio":0.73,"comision":0,"monto_neto":2195.11,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-10","ticker":"YMCOD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":274.0,"precio":0.81,"comision":0,"monto_neto":221.94,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-10","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":11309.0,"precio":1.037,"comision":0,"monto_neto":11727.433,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-14","ticker":"YMCYD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":25000.0,"precio":1.0,"comision":0,"monto_neto":-25000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-14","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":499.85,"comision":0,"monto_neto":-499.85,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-10-14","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":7450.0,"precio":1.0395,"comision":0,"monto_neto":7744.275,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-14","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":738.72,"comision":0,"monto_neto":738.72,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-14","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":2597.16,"comision":0,"monto_neto":2597.16,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-14","ticker":"SNS8D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-16","ticker":"GD29D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":6736.0,"precio":0.727,"comision":0,"monto_neto":-4897.072,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-16","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1640.0,"precio":0.935,"comision":0,"monto_neto":1533.4,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-17","ticker":"GD35D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":22847.0,"precio":0.569,"comision":0,"monto_neto":-12999.943,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-17","ticker":"GD46D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":25210.0,"precio":0.595,"comision":0,"monto_neto":-14999.95,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-18","ticker":"SNS8D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":300.0,"precio":1.02,"comision":0,"monto_neto":306.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-18","ticker":"SNS8D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":711.0,"precio":1.022,"comision":0,"monto_neto":726.642,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-21","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":61.0,"precio":0.935,"comision":0,"monto_neto":57.035,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-21","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3937.0,"precio":1.033,"comision":0,"monto_neto":4066.921,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-21","ticker":"SNS8D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":8989.0,"precio":1.021,"comision":0,"monto_neto":9177.769,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-21","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20000.0,"precio":1.0,"comision":0,"monto_neto":-20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-22","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1593.0,"precio":1.0355,"comision":0,"monto_neto":1649.5515,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-24","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":393.0,"precio":12.7,"comision":0,"monto_neto":-4991.1,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-27","ticker":"TN63D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":20000.0,"precio":1.0,"comision":0,"monto_neto":-20000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-28","ticker":"GD35D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":22847.0,"precio":0.585,"comision":0,"monto_neto":13365.495,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-28","ticker":"GD29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":6736.0,"precio":0.74551,"comision":0.01,"monto_neto":5021.74536,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-28","ticker":"MGCND","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":109.0,"precio":1.02,"comision":0,"monto_neto":111.18,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":-2000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-29","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":14705.0,"precio":1.02,"comision":0,"monto_neto":-14999.1,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-29","ticker":"GD46D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":25210.0,"precio":0.6064,"comision":0,"monto_neto":15287.344,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-29","ticker":"MGCND","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1268.0,"precio":1.025,"comision":0,"monto_neto":1299.7,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-30","ticker":"MGCND","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":11623.0,"precio":1.021,"comision":0,"monto_neto":11867.083,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-31","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":382.0,"precio":1.01,"comision":0,"monto_neto":-385.82,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-31","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":197.0,"comision":0,"monto_neto":197.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-10-31","ticker":"GD38D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":23809.0,"precio":0.63,"comision":0,"monto_neto":-14999.67,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-01","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":4003.0,"precio":1.03,"comision":0,"monto_neto":4123.09,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-01","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":30000.0,"precio":1.0,"comision":0,"monto_neto":-30000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-01","ticker":"YMCYD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-04","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.52,"comision":0,"monto_neto":-999.52,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-11-04","ticker":"GD38D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":23809.0,"precio":0.64,"comision":0,"monto_neto":15237.76,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-05","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":6463.0,"precio":1.053,"comision":0,"monto_neto":6805.539,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-06","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":15624.0,"precio":0.93,"comision":0,"monto_neto":14530.32,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-07","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.51,"comision":0,"monto_neto":-999.51,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-11-08","ticker":"CAC8D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-08","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.33,"comision":0,"monto_neto":-999.33,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-11-08","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":211.0,"precio":0.937,"comision":0,"monto_neto":197.707,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-11","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":299.66,"comision":0,"monto_neto":-299.66,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-11-11","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.51,"comision":0,"monto_neto":-999.51,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-11-11","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":74.0,"precio":1.057,"comision":0,"monto_neto":78.218,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-11","ticker":"Minera","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":14908.0,"precio":1.0,"comision":0,"monto_neto":-14908.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-12","ticker":"RCCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":645.0,"precio":0.93,"comision":0,"monto_neto":599.85,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-13","ticker":"Pfizer","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":735.0,"precio":6.8,"comision":0,"monto_neto":-4998.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-13","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":4636.0,"precio":1.057,"comision":0,"monto_neto":4900.252,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-20","ticker":"LMS9D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3914.0,"precio":1.05,"comision":0,"monto_neto":4109.7,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-21","ticker":"CAC8D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10000.0,"precio":1.02,"comision":0,"monto_neto":10200.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-24","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1000.0,"comision":0,"monto_neto":-1000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-25","ticker":"YMCYD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":15000.0,"precio":1.02,"comision":0,"monto_neto":15300.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-28","ticker":"MGCHD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":14895.0,"precio":1.007,"comision":0,"monto_neto":-14999.265,"cuenta":"Galicia","comentario":null},{"fecha":"2024-11-28","ticker":"Minera","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":14908.0,"precio":1.02,"comision":0,"monto_neto":15206.16,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-06","ticker":"MGCHD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":6466.0,"precio":1.03,"comision":0,"monto_neto":6659.98,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-09","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1000.0,"comision":0,"monto_neto":-1000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-09","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":999.47,"comision":0,"monto_neto":-999.47,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2024-12-17","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":6637.0,"precio":0.904,"comision":0,"monto_neto":-5999.848,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-18","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":3000.0,"comision":0,"monto_neto":-3000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-19","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":18.81,"comision":0,"monto_neto":18.81,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-26","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":3116.0,"comision":0,"monto_neto":3116.0,"cuenta":"Galicia","comentario":null},{"fecha":"2024-12-30","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":235.96,"comision":0,"monto_neto":235.96,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-03","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10309.0,"precio":0.97,"comision":0,"monto_neto":-9999.73,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-06","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":7000.0,"comision":0,"monto_neto":7000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-08","ticker":"TN63D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":5773.0,"precio":1.02,"comision":0,"monto_neto":5888.46,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-17","ticker":"OT42D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":1.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-20","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":10.0,"comision":0,"monto_neto":-10.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-22","ticker":"TN63D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":14227.0,"precio":1.03,"comision":0,"monto_neto":14653.81,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-26","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":-2000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-26","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":6992.41,"comision":0,"monto_neto":-6992.41,"cuenta":"Galicia","comentario":null},{"fecha":"2025-01-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":499.54,"comision":0,"monto_neto":-499.54,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2025-02-05","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":600.0,"comision":0,"monto_neto":600.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-02-06","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":14413.0,"precio":1.006,"comision":0,"monto_neto":-14499.478,"cuenta":"Galicia","comentario":null},{"fecha":"2025-02-13","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10309.0,"precio":1.0,"comision":0,"monto_neto":10309.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-02-14","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10300.0,"precio":1.0,"comision":0,"monto_neto":-10300.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-02-17","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":349.85,"comision":0,"monto_neto":-349.85,"cuenta":"Galicia","comentario":"Dolar MEP"},{"fecha":"2025-03-12","ticker":"Pfizer","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":51.29,"comision":0,"monto_neto":51.29,"cuenta":"Galicia","comentario":null},{"fecha":"2025-03-20","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":18.81,"comision":0,"monto_neto":18.81,"cuenta":"Galicia","comentario":null},{"fecha":"2025-03-25","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":0.0,"precio":164.91,"comision":0,"monto_neto":164.91,"cuenta":"Galicia","comentario":null},{"fecha":"2025-03-25","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":14413.0,"precio":1.0,"comision":0,"monto_neto":14413.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-03-27","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":10000.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-03-27","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":10000.0,"comision":0,"monto_neto":10000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-03-31","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":500.0,"precio":1.0,"comision":2.5,"monto_neto":-502.5,"cuenta":"Balanz","comentario":null},{"fecha":"2025-03-31","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":300.0,"comision":0,"monto_neto":-300.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-03","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":14051.0,"precio":0.629547,"comision":44.23,"monto_neto":-8889.999998,"cuenta":"Balanz","comentario":null},{"fecha":"2025-04-07","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":17000.0,"comision":0,"monto_neto":17000.0,"cuenta":"Galicia","comentario":"Tranferencia por Ariel"},{"fecha":"2025-04-07","ticker":"MGCHD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":480.0,"precio":0.992,"comision":0,"monto_neto":-476.16,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-07","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":871.0,"precio":0.608,"comision":2.65,"monto_neto":-532.218,"cuenta":"Balanz","comentario":null},{"fecha":"2025-04-10","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":478.87,"comision":0,"monto_neto":478.87,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-10","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":16.14,"comision":0,"monto_neto":16.14,"cuenta":"Balanz","comentario":null},{"fecha":"2025-04-14","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1000.0,"comision":0,"monto_neto":-1000.0,"cuenta":"Galicia","comentario":"Ariel 695"},{"fecha":"2025-04-14","ticker":"AL30D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":14922.0,"precio":0.6542,"comision":48.81,"monto_neto":9713.1624,"cuenta":"Balanz","comentario":null},{"fecha":"2025-04-15","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":15306.0,"precio":0.98,"comision":0,"monto_neto":-14999.88,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-15","ticker":"IRCND","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9000.0,"precio":0.975,"comision":43.88,"monto_neto":-8818.88,"cuenta":"Balanz","comentario":null},{"fecha":"2025-04-21","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":491.15,"comision":0,"monto_neto":491.15,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-23","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":318.0,"precio":1.03,"comision":0,"monto_neto":327.54,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-23","ticker":"MGCHD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":8909.0,"precio":1.04,"comision":0,"monto_neto":9265.36,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-24","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":260.22,"comision":0,"monto_neto":260.22,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-25","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9927.0,"precio":0.96,"comision":0,"monto_neto":-9529.92,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-25","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":5000.0,"precio":1.005,"comision":0,"monto_neto":5025.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-28","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":3350.0,"precio":1.01,"comision":0,"monto_neto":-3383.5,"cuenta":"Galicia","comentario":null},{"fecha":"2025-04-29","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":197.1,"comision":0,"monto_neto":197.1,"cuenta":"Galicia","comentario":"Lili, se debita el mes que viene"},{"fecha":"2025-05-19","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":500.0,"comision":0,"monto_neto":-500.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-05-19","ticker":"IRCND","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":9000.0,"precio":1.0,"comision":45.0,"monto_neto":8955.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-05-25","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":200.0,"comision":0,"monto_neto":-200.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-05-30","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1187.52,"comision":0,"monto_neto":-1187.52,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-01","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":4000.0,"comision":0,"monto_neto":4000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-02","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":265.5,"comision":0,"monto_neto":-265.5,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-03","ticker":"VSCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":181.0,"precio":1.01,"comision":0.91,"monto_neto":-183.72,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-03","ticker":"PECAD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":305.0,"precio":0.92,"comision":1.4,"monto_neto":-282.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-05","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":2000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-06-05","ticker":"VSCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":2.04,"comision":0,"monto_neto":2.04,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-05","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":6970.0,"precio":0.732,"comision":25.51,"monto_neto":-5127.55,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-05","ticker":"VSCTD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":0.9995,"comision":0,"monto_neto":-9995.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-05","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":-2000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-10","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":294.15,"comision":0,"monto_neto":294.15,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-13","ticker":"VSCTD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":375.53,"comision":0,"monto_neto":375.53,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-19","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2349.47,"comision":0,"monto_neto":2349.47,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-06-19","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1350.0,"comision":0,"monto_neto":-1350.0,"cuenta":"Galicia","comentario":"Ariel 1350"},{"fecha":"2025-06-19","ticker":"Pfizer","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":51.29,"comision":0,"monto_neto":51.29,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-19","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2349.47,"comision":0,"monto_neto":-2349.47,"cuenta":"Balanz","comentario":null},{"fecha":"2025-06-23","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":106.94,"comision":0,"monto_neto":106.94,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-23","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":18.81,"comision":0,"monto_neto":18.81,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-26","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":235.96,"comision":0,"monto_neto":235.96,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-27","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":1161.47,"comision":0,"monto_neto":1161.47,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-30","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2900.0,"comision":0,"monto_neto":2900.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-30","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":4953.93,"comision":0,"monto_neto":-4953.93,"cuenta":"Galicia","comentario":null},{"fecha":"2025-06-30","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":3030.0,"precio":0.99,"comision":0,"monto_neto":-2999.7,"cuenta":"Galicia","comentario":null},{"fecha":"2025-07-01","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2400.0,"comision":0,"monto_neto":2400.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-07-01","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2400.0,"comision":0,"monto_neto":2400.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-03","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2452.0,"precio":0.9718,"comision":11.9,"monto_neto":-2394.7536,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2400.0,"comision":0,"monto_neto":-2400.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-07-10","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Cupón / interés","cantidad":null,"precio":69.7,"comision":0,"monto_neto":69.7,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-10","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Cupón / interés","cantidad":null,"precio":658.64,"comision":0,"monto_neto":658.64,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-15","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":2000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-07-21","ticker":"VSCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":181.0,"precio":1.00565,"comision":0,"monto_neto":182.02265,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-23","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":915.61,"comision":0,"monto_neto":915.61,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-07-23","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":915.61,"comision":0,"monto_neto":-915.61,"cuenta":"Balanz","comentario":null},{"fecha":"2025-07-24","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":263.11,"comision":0,"monto_neto":263.11,"cuenta":"Galicia","comentario":null},{"fecha":"2025-08-01","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":1547.12,"comision":0,"monto_neto":1547.12,"cuenta":"Galicia","comentario":null},{"fecha":"2025-08-04","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":292.93,"comision":0,"monto_neto":-292.93,"cuenta":"Galicia","comentario":"VIaje ARiel"},{"fecha":"2025-08-20","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":1000.0,"comision":0,"monto_neto":1000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-08-23","ticker":"PECAD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":12.6,"comision":0,"monto_neto":12.6,"cuenta":"Balanz","comentario":null},{"fecha":"2025-09-01","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":238.07,"comision":0,"monto_neto":-238.07,"cuenta":"Galicia","comentario":"VIaje ARiel"},{"fecha":"2025-09-03","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":2000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-05","ticker":"Pfizer","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":51.29,"comision":0,"monto_neto":51.29,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-08","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":1900.0,"comision":0,"monto_neto":1900.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-09","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":9216.0,"precio":0.5421,"comision":0,"monto_neto":-4995.9936,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-19","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Cupón / interés","cantidad":null,"precio":18.81,"comision":0,"monto_neto":18.81,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-23","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":9216.0,"precio":0.593,"comision":0,"monto_neto":5465.088,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-24","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":2537.0,"precio":1.025,"comision":0,"monto_neto":2600.425,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-25","ticker":"YMCQD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":493.0,"precio":1.03,"comision":0,"monto_neto":507.79,"cuenta":"Galicia","comentario":null},{"fecha":"2025-09-26","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":3639.04,"comision":0,"monto_neto":-3639.04,"cuenta":"Galicia","comentario":"Disney"},{"fecha":"2025-09-30","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":85.52,"comision":0,"monto_neto":85.52,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-01","ticker":"Pfizer","tipo_activo":"Acción","tipo_mov":"Venta","cantidad":735.0,"precio":7.21088,"comision":0,"monto_neto":5299.9968,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-01","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":9699.0,"precio":0.5155,"comision":0,"monto_neto":-4999.8345,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-03","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":9698.0,"precio":0.58,"comision":0,"monto_neto":5624.84,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-06","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":4000.0,"comision":0,"monto_neto":-4000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-08","ticker":"OT42D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10000.0,"precio":1.04,"comision":0,"monto_neto":10400.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-08","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":1.0,"precio":0.562,"comision":0,"monto_neto":0.562,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-09","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":5000.0,"comision":0,"monto_neto":-5000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-10-09","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":6968.0,"precio":0.59586,"comision":20.76,"monto_neto":4131.189999,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-09","ticker":"AL29D","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":2.0,"precio":0.6049,"comision":0,"monto_neto":1.2098,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-09","ticker":"IRCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9689.0,"precio":1.0145,"comision":49.19,"monto_neto":-9878.680016,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-09","ticker":"TLCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":8758.0,"precio":1.025,"comision":44.88,"monto_neto":-9021.83,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-09","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":10000.0,"comision":0,"monto_neto":10000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-09","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":10000.0,"comision":0,"monto_neto":-10000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-10-09","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":5000.0,"comision":0,"monto_neto":5000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-13","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":800.15,"comision":0,"monto_neto":800.15,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-13","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":16.23,"comision":0,"monto_neto":16.23,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-14","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":15000.0,"precio":1.0,"comision":0,"monto_neto":-15000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-15","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":7000.0,"comision":0,"monto_neto":7000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-15","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":7000.0,"comision":0,"monto_neto":-7000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-10-15","ticker":"TLCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":6693.0,"precio":1.028,"comision":34.4,"monto_neto":-6914.804,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-16","ticker":"Mcdonalds","tipo_activo":"Acción","tipo_mov":"Venta","cantidad":393.0,"precio":12.926209,"comision":0,"monto_neto":5080.000019,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-21","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":920.0,"comision":0,"monto_neto":920.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-21","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":370.38,"comision":0,"monto_neto":370.38,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-23","ticker":"IRCGD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":45.0,"precio":1.0485,"comision":0,"monto_neto":47.1825,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-24","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":266.0,"comision":0,"monto_neto":266.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-27","ticker":"IRCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":415.0,"precio":1.02,"comision":2.12,"monto_neto":-425.42,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-28","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":6145.0,"precio":0.9669,"comision":29.73,"monto_neto":-5971.3305,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-28","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":6000.0,"comision":0,"monto_neto":-6000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-10-28","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":6000.0,"comision":0,"monto_neto":6000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-29","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":5009.63,"comision":0,"monto_neto":5009.63,"cuenta":"Galicia","comentario":null},{"fecha":"2025-10-29","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":3036.0,"precio":0.98247,"comision":14.92,"monto_neto":-2997.700001,"cuenta":"Balanz","comentario":null},{"fecha":"2025-10-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":3000.0,"comision":0,"monto_neto":-3000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-10-29","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":3000.0,"comision":0,"monto_neto":3000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-01","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":521.37,"comision":0,"monto_neto":521.37,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2410.7,"comision":0,"monto_neto":-2410.7,"cuenta":"Galicia","comentario":"Disney"},{"fecha":"2025-11-05","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":776.0,"precio":0.7156,"comision":0,"monto_neto":555.3056,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-05","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":4822.0,"precio":0.7124,"comision":0,"monto_neto":3435.1928,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-05","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3583.0,"precio":1.0275,"comision":0,"monto_neto":3681.5325,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-05","ticker":"VSCTD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10000.0,"precio":1.0575,"comision":0,"monto_neto":10575.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-06","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9835.0,"precio":0.9994,"comision":49.15,"monto_neto":-9878.249,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-06","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":15000.0,"comision":0,"monto_neto":15000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-06","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":15000.0,"comision":0,"monto_neto":-15000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-11-07","ticker":"ZPC3O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":5000.0,"precio":1.015,"comision":25.38,"monto_neto":-5100.38,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-17","ticker":"TLCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":15451.0,"precio":1.0985,"comision":84.72,"monto_neto":16888.19995,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-18","ticker":"PECAD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":305.0,"precio":0.61,"comision":0.93,"monto_neto":185.12,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-18","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":16879.0,"precio":1.004889,"comision":84.81,"monto_neto":-17046.33008,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-25","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":16000.0,"comision":0,"monto_neto":16000.0,"cuenta":"Galicia","comentario":"Disney"},{"fecha":"2025-11-26","ticker":"IRCPO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":10104.0,"precio":1.059,"comision":0.14,"monto_neto":10699.996,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-27","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":700.0,"comision":0,"monto_neto":-700.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-27","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":700.0,"comision":0,"monto_neto":700.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-11-28","ticker":"CP36D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":1936.0,"precio":0.845,"comision":8.18,"monto_neto":-1644.1,"cuenta":"Balanz","comentario":null},{"fecha":"2025-11-28","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":8268.0,"precio":1.0035,"comision":41.48,"monto_neto":-8338.418,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-01","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":400.0,"comision":0,"monto_neto":-400.0,"cuenta":"Galicia","comentario":"Crucero"},{"fecha":"2025-12-03","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":13000.0,"comision":0,"monto_neto":13000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-03","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":13000.0,"comision":0,"monto_neto":-13000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-12-05","ticker":"Cambio de moneda","tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":13101.49,"comision":0,"monto_neto":-13101.49,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-05","ticker":"Cambio de moneda","tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":12605.1,"comision":0,"monto_neto":12605.1,"cuenta":"Balanz CCL","comentario":null},{"fecha":"2025-12-05","ticker":"VSCVO CCL","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":12000.0,"precio":1.017422,"comision":0,"monto_neto":-12209.06,"cuenta":"Balanz CCL","comentario":null},{"fecha":"2025-12-10","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":9792.0,"precio":1.011,"comision":0,"monto_neto":9899.712,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-10","ticker":"IRCLD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":295.78,"comision":0,"monto_neto":295.78,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-10","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":5000.0,"precio":1.0,"comision":0,"monto_neto":5000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-11","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":5768.0,"precio":0.952,"comision":27.46,"monto_neto":-5518.596,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-11","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":8000.0,"comision":0,"monto_neto":-8000.0,"cuenta":"Galicia","comentario":"Balanz"},{"fecha":"2025-12-11","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":8000.0,"comision":0,"monto_neto":8000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-12","ticker":"YMCJD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":2452.0,"precio":1.0125,"comision":12.41,"monto_neto":2470.24,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-12","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2568.0,"precio":0.95,"comision":12.2,"monto_neto":-2451.8,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-12","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1901.0,"precio":1.0185,"comision":0,"monto_neto":1936.1685,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-13","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":4591.6,"comision":0,"monto_neto":4591.6,"cuenta":"Galicia","comentario":"Por comisiones al 15/12"},{"fecha":"2025-12-13","ticker":null,"tipo_activo":null,"tipo_mov":"Compra","cantidad":null,"precio":0.0,"comision":4591.6,"monto_neto":-4591.6,"cuenta":"Galicia","comentario":"Por comisiones al 15/12"},{"fecha":"2025-12-15","ticker":"LDCGO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2574.0,"precio":0.955,"comision":12.29,"monto_neto":-2470.46,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-18","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":18764.0,"precio":1.052671,"comision":98.76,"monto_neto":19653.55,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-19","ticker":"DNC5D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":25399.0,"precio":1.052,"comision":133.6,"monto_neto":26586.148,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-19","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":6219.0,"precio":0.985791,"comision":30.65,"monto_neto":-6161.285,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-22","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2000.0,"comision":0,"monto_neto":-2000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-22","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":107.53,"comision":0,"monto_neto":107.53,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-22","ticker":"LOC2D","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3350.0,"precio":1.0,"comision":0,"monto_neto":3350.0,"cuenta":"Galicia","comentario":null},{"fecha":"2025-12-22","ticker":"DNC7O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":15000.0,"precio":1.03,"comision":77.25,"monto_neto":-15527.25,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-22","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":5000.0,"precio":1.0,"comision":25.0,"monto_neto":-5025.0,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-22","ticker":"IRCNO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":1773.0,"precio":1.01,"comision":8.95,"monto_neto":-1799.68,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-22","ticker":"RUCAO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":10000.0,"precio":1.01,"comision":50.5,"monto_neto":-10150.5,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-23","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2000.0,"precio":1.008,"comision":10.08,"monto_neto":-2026.08,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-23","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2100.0,"precio":1.02,"comision":10.71,"monto_neto":-2152.71,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-24","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":8200.0,"comision":0,"monto_neto":-8200.0,"cuenta":"Galicia","comentario":"a mercadopago"},{"fecha":"2025-12-24","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":988.0,"precio":1.025,"comision":5.06,"monto_neto":1007.64,"cuenta":"Balanz","comentario":null},{"fecha":"2025-12-30","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":29.04,"comision":0,"monto_neto":29.04,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-02","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":4400.0,"comision":0,"monto_neto":-4400.0,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-05","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":6768.02,"comision":0,"monto_neto":-6768.02,"cuenta":"Galicia","comentario":"Tarjeta disney"},{"fecha":"2026-01-05","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1100.0,"comision":0,"monto_neto":-1100.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-05","ticker":"VSCVO CCL","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":12000.0,"precio":1.062,"comision":63.72,"monto_neto":12680.28,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-08","ticker":"DNC3O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9548.0,"precio":1.0295,"comision":49.15,"monto_neto":-9878.816,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-08","ticker":"AE38","tipo_activo":"Bono","tipo_mov":"Compra","cantidad":522.0,"precio":0.7447,"comision":1.94,"monto_neto":-390.6734,"cuenta":"Balanz CCL","comentario":null},{"fecha":"2026-01-09","ticker":"IRCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1039.0,"precio":0.69,"comision":1.93,"monto_neto":714.98,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-12","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":3000.0,"precio":1.0,"comision":0,"monto_neto":3000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-20","ticker":"AE38","tipo_activo":"Bono","tipo_mov":"Venta","cantidad":522.0,"precio":0.7821,"comision":2.04,"monto_neto":406.2162,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-12","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":299.78,"comision":0,"monto_neto":-299.78,"cuenta":"Balanz","comentario":"Cambio Ariel"},{"fecha":"2026-01-21","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":8417.0,"precio":1.0,"comision":0,"monto_neto":8417.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-21","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":33.0,"comision":0,"monto_neto":33.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-21","ticker":"HJCFD","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":null,"precio":null,"comision":33.0,"monto_neto":-33.0,"cuenta":"Galicia","comentario":"Comisiones que se pagan en pesos"},{"fecha":"2026-01-22","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":7000.0,"comision":0,"monto_neto":-7000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-22","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":7000.0,"comision":0,"monto_neto":7000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-22","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":9356.0,"precio":1.013,"comision":47.39,"monto_neto":-9525.018,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-23","ticker":"IRCNO","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":51.21,"comision":0,"monto_neto":51.21,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-28","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1000.0,"comision":0,"monto_neto":-1000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-26","ticker":"OTS2D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":62.78,"comision":0,"monto_neto":62.78,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-02","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":434.47,"comision":0,"monto_neto":434.47,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-02","ticker":"OTS3D","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":35.16,"comision":0,"monto_neto":35.16,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-28","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":0.24,"comision":0,"monto_neto":0.24,"cuenta":"Balanz","comentario":null},{"fecha":"2026-01-29","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":8518.59,"comision":0,"monto_neto":8518.59,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":5077.04,"comision":0,"monto_neto":-5077.04,"cuenta":"Galicia","comentario":null},{"fecha":"2026-01-29","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":8346.25,"comision":0,"monto_neto":-8346.25,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-04","ticker":"LDCGO","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":45.25,"comision":0,"monto_neto":45.25,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-06","ticker":"LDCGO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":2574.0,"precio":0.99,"comision":12.74,"monto_neto":2535.52,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-09","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":746.0,"comision":0,"monto_neto":746.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-09","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":5000.0,"comision":0,"monto_neto":5000.0,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-11","ticker":"COIN","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":1289.0,"precio":6.1,"comision":39.31,"monto_neto":-7902.21,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-18","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":3500.0,"comision":0,"monto_neto":3500.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-18","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Cupón / interés","cantidad":null,"precio":1206.55,"comision":0,"monto_neto":1206.55,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-18","ticker":"PQCSO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":6976.0,"precio":1.01,"comision":35.23,"monto_neto":7010.53,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-18","ticker":"IRCNO","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":1000.0,"precio":1.011,"comision":5.06,"monto_neto":1005.94,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-18","ticker":"CWC6O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":2300.0,"precio":0.956,"comision":10.99,"monto_neto":-2209.79,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-18","ticker":"CWC6O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":963.0,"precio":0.956,"comision":0,"monto_neto":-920.628,"cuenta":"Galicia","comentario":null},{"fecha":"2026-02-20","ticker":"CWC6O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":7074.0,"precio":1.0,"comision":35.37,"monto_neto":-7109.37,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-20","ticker":"COIN","tipo_activo":"Acción","tipo_mov":"Venta","cantidad":1289.0,"precio":6.55,"comision":42.21,"monto_neto":8400.74,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-23","ticker":"IBIT","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":2139.0,"precio":3.9,"comision":41.71,"monto_neto":-8383.81,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-24","ticker":"DNC7O","tipo_activo":"Obligación Negociable","tipo_mov":"Venta","cantidad":15000.0,"precio":1.088013,"comision":81.6,"monto_neto":16238.595,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-25","ticker":"IBIT","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":1263.0,"precio":3.89,"comision":24.57,"monto_neto":-4937.64,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-25","ticker":"EAC3O","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":5000.0,"precio":0.9697,"comision":24.24,"monto_neto":-4872.74,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-27","ticker":"IBIT","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":1535.0,"precio":3.84,"comision":29.47,"monto_neto":-5923.87,"cuenta":"Balanz","comentario":null},{"fecha":"2026-02-27","ticker":null,"tipo_activo":null,"tipo_mov":"Depósito","cantidad":null,"precio":6298.3,"comision":0,"monto_neto":6298.3,"cuenta":"Galicia","comentario":null},{"fecha":"2026-03-02","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":2745.11,"comision":0,"monto_neto":-2745.11,"cuenta":"Galicia","comentario":"Visa"},{"fecha":"2026-03-02","ticker":null,"tipo_activo":null,"tipo_mov":"Extracción","cantidad":null,"precio":1085.76,"comision":0,"monto_neto":-1085.76,"cuenta":"Galicia","comentario":"Am Express"},{"fecha":"2026-03-04","ticker":"IBIT","tipo_activo":"Acción","tipo_mov":"Venta","cantidad":4937.0,"precio":4.232723,"comision":104.48,"monto_neto":20792.475,"cuenta":"Balanz","comentario":null},{"fecha":"2026-03-05","ticker":"TLCUD","tipo_activo":"Obligación Negociable","tipo_mov":"Compra","cantidad":7000.0,"precio":1.0,"comision":0,"monto_neto":-7000.0,"cuenta":"Galicia","comentario":null},{"fecha":"2026-03-05","ticker":"ANF","tipo_activo":"Acción","tipo_mov":"Compra","cantidad":28.0,"precio":91.0,"comision":12.74,"monto_neto":-2560.74,"cuenta":"Balanz","comentario":null}];
const ARQUEOS_HISTORICOS = [{"id":"2024-01","mes":"ene 2024","efectivo_total":225.1,"capital_invertido":1800.0,"efectivo_galicia":225.1,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":1800.0,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-02","mes":"feb 2024","efectivo_total":225.1,"capital_invertido":1800.0,"efectivo_galicia":225.1,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":1800.0,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-03","mes":"mar 2024","efectivo_total":225.1,"capital_invertido":1800.0,"efectivo_galicia":225.1,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":1800.0,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-04","mes":"abr 2024","efectivo_total":225.1,"capital_invertido":1800.0,"efectivo_galicia":225.1,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":1800.0,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-05","mes":"may 2024","efectivo_total":38009.31,"capital_invertido":9996.68,"efectivo_galicia":38009.31,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":9996.68,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-06","mes":"jun 2024","efectivo_total":6000.9,"capital_invertido":39996.55,"efectivo_galicia":6000.9,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":39996.55,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-07","mes":"jul 2024","efectivo_total":59.26,"capital_invertido":45581.42,"efectivo_galicia":59.26,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":45581.42,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-08","mes":"ago 2024","efectivo_total":8045.32,"capital_invertido":96735.78,"efectivo_galicia":8045.32,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":96735.78,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-09","mes":"sep 2024","efectivo_total":2106.84,"capital_invertido":122078.11,"efectivo_galicia":2106.84,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":122078.11,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-10","mes":"oct 2024","efectivo_total":11061.58,"capital_invertido":111580.48,"efectivo_galicia":11061.58,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":111580.48,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-11","mes":"nov 2024","efectivo_total":32147.38,"capital_invertido":85197.15,"efectivo_galicia":32147.38,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":85197.15,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2024-12","mes":"dic 2024","efectivo_total":31178.81,"capital_invertido":84537.02,"efectivo_galicia":31178.81,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":84537.02,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2025-01","mes":"ene 2025","efectivo_total":29219.4,"capital_invertido":83994.48,"efectivo_galicia":29219.4,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":83994.48,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2025-02","mes":"feb 2025","efectivo_total":14979.08,"capital_invertido":98484.95,"efectivo_galicia":14979.08,"efectivo_balanz":0,"efectivo_balanz_ccl":0,"capital_galicia":98484.95,"capital_balanz":0,"capital_balanz_ccl":0},{"id":"2025-03","mes":"mar 2025","efectivo_total":28824.59,"capital_invertido":84574.45,"efectivo_galicia":19327.09,"efectivo_balanz":9497.5,"efectivo_balanz_ccl":0,"capital_galicia":84071.95,"capital_balanz":502.5,"capital_balanz_ccl":0},{"id":"2025-04","mes":"abr 2025","efectivo_total":23968.57,"capital_invertido":106873.95,"efectivo_galicia":22982.87,"efectivo_balanz":985.7,"efectivo_balanz_ccl":0,"capital_galicia":97843.51,"capital_balanz":9030.44,"capital_balanz_ccl":0},{"id":"2025-05","mes":"may 2025","efectivo_total":31036.05,"capital_invertido":97918.95,"efectivo_galicia":21095.35,"efectivo_balanz":9940.7,"efectivo_balanz_ccl":0,"capital_galicia":97843.51,"capital_balanz":75.44,"capital_balanz_ccl":0},{"id":"2025-06","mes":"jun 2025","efectivo_total":15024.84,"capital_invertido":116506.92,"efectivo_galicia":15024.84,"efectivo_balanz":0.0,"efectivo_balanz_ccl":0,"capital_galicia":110838.21,"capital_balanz":5668.71,"capital_balanz_ccl":0},{"id":"2025-07","mes":"jul 2025","efectivo_total":18203.56,"capital_invertido":118719.65,"efectivo_galicia":18203.56,"efectivo_balanz":0.0,"efectivo_balanz_ccl":0,"capital_galicia":110838.21,"capital_balanz":7881.44,"capital_balanz_ccl":0},{"id":"2025-08","mes":"ago 2025","efectivo_total":20470.35,"capital_invertido":118719.65,"efectivo_galicia":20457.75,"efectivo_balanz":12.6,"efectivo_balanz_ccl":0,"capital_galicia":110838.21,"capital_balanz":7881.44,"capital_balanz_ccl":0},{"id":"2025-09","mes":"sep 2025","efectivo_total":24226.17,"capital_invertido":115142.34,"efectivo_galicia":24128.05,"efectivo_balanz":98.12,"efectivo_balanz_ccl":0,"capital_galicia":107260.9,"capital_balanz":7881.44,"capital_balanz_ccl":0},{"id":"2025-10","mes":"oct 2025","efectivo_total":2983.94,"capital_invertido":139766.96,"efectivo_galicia":2946.95,"efectivo_balanz":36.99,"efectivo_balanz_ccl":0,"capital_galicia":100808.16,"capital_balanz":38958.8,"capital_balanz_ccl":0},{"id":"2025-11","mes":"nov 2025","efectivo_total":21107.48,"capital_invertido":135754.09,"efectivo_galicia":21004.65,"efectivo_balanz":102.83,"efectivo_balanz_ccl":0,"capital_galicia":82561.13,"capital_balanz":53192.96,"capital_balanz_ccl":0},{"id":"2025-12","mes":"dic 2025","efectivo_total":14854.48,"capital_invertido":135934.65,"efectivo_galicia":10022.88,"efectivo_balanz":4435.55,"efectivo_balanz_ccl":396.04,"capital_galicia":66966.85,"capital_balanz":56758.75,"capital_balanz_ccl":12209.06},{"id":"2026-01","mes":"ene 2026","efectivo_total":1920.18,"capital_invertido":130543.68,"efectivo_galicia":1444.92,"efectivo_balanz":469.89,"efectivo_balanz_ccl":5.37,"capital_galicia":54867.87,"capital_balanz":63076.08,"capital_balanz_ccl":12599.73},{"id":"2026-02","mes":"feb 2026","efectivo_total":12117.17,"capital_invertido":137612.42,"efectivo_galicia":11503.07,"efectivo_balanz":608.74,"efectivo_balanz_ccl":5.37,"efectivo_casa":1300,"efectivo_brubank":400,"efectivo_caja_superville":10000,"efectivo_bid":3150,"capital_galicia":55788.49,"capital_balanz":69224.19,"capital_balanz_ccl":12599.73}];

const DB = {patrimonio_total:132810.49,saldo_operar:19518.04,invertido:113292.45,resultado_total:14620.35,rendimiento_promedio:1.41};
const CUENTAS_DEFAULT = ["Galicia","Balanz","Balanz CCL","Casa","Brubank","Caja Superville","Bid"];
const PIE_COLORS = ["#d4a843","#2196f3","#e74c3c","#2ecc71","#9b59b6"];
const f$ = n => new Intl.NumberFormat("es-AR",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n??0);
const fPct = n => `${n>=0?"+":""}${(n*1).toFixed(2)}%`;
const mcol = t => {
  if(t==="Compra") return {bg:"#1a2e1a",c:"#7ec87e"};
  if(t?.includes("Venta")) return {bg:"#2e1a1a",c:"#e87c7c"};
  if(t==="Depósito") return {bg:"#1a2a1a",c:"#7ec8b0"};
  if(t==="Extracción") return {bg:"#2a1a1a",c:"#e8a07c"};
  return {bg:"#1a1a2a",c:"#c8a96e"};
};
const TIPOS_SIN_ACTIVO = ["Depósito","Extracción","Transferencia"];

const S = {fontFamily:"'Georgia','Times New Roman',serif",background:"#0d0b06",minHeight:"100vh",color:"#f0e6c8"};
const card = {background:"linear-gradient(135deg,#1a1408,#120f05)",border:"1px solid #3a3010",borderRadius:12,padding:"18px 20px"};
const tbl = {background:"#120f05",border:"1px solid #3a3010",borderRadius:12,overflow:"hidden"};
const inp = {background:"#120f05",border:"1px solid #3a3010",color:"#f0e6c8",padding:"8px 12px",borderRadius:8,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
const lbl = {fontSize:11,color:"#8b7c4a",display:"block",marginBottom:4};
const TH = {padding:"12px 14px",textAlign:"right",color:"#8b7c4a",fontSize:11,fontWeight:"normal",textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:"1px solid #2a2010",whiteSpace:"nowrap"};
const TD = (x={}) => ({padding:"11px 14px",textAlign:"right",...x});
const btn = (active=false,extra={}) => ({padding:"7px 16px",borderRadius:8,border:active?"1px solid #d4a843":"1px solid #3a3010",background:active?"#2a1f08":"transparent",color:active?"#d4a843":"#8b7c4a",fontSize:13,cursor:"pointer",...extra});

export default function App() {
  const [tab,setTab] = useState("dashboard");
  const [search,setSearch] = useState("");
  const [posTab,setPosTab] = useState("abiertas");
  const [tickerAbierto,setTickerAbierto] = useState(null);
  const [showEfectivo,setShowEfectivo] = useState(false);
  const [movs,setMovs] = useState([]);
  const [arqs,setArqs] = useState([]);
  const [cuentas,setCuentas] = useState(CUENTAS_DEFAULT);
  const [ldMovs,setLdMovs] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [saving,setSaving] = useState(false);
  const [msg,setMsg] = useState("");
  const [nuevaCuenta,setNuevaCuenta] = useState("");
  const [arqSelId,setArqSelId] = useState(null);
  const [arqFecha,setArqFecha] = useState("");
  const [sortConfig,setSortConfig] = useState({key:"capital",dir:"desc"});
  const [filtros,setFiltros] = useState({fechaDesde:"",fechaHasta:"",cuenta:"",tipo_mov:"",ticker:""});
  const [form,setForm] = useState({fecha:"",ticker:"",tipo_activo:"ON",tipo_mov:"Compra",cantidad:"",precio:"",comision:"0",cuenta:"Galicia",comentario:""});

  // Build dynamic account list from cuentas + movements + latest arqueo fields
  const todasCuentas = useMemo(()=>{
    const fromMovs = [...new Set(movs.map(m=>m.cuenta).filter(Boolean))];
    // Also include any account that has efectivo data in any arqueo (historical or supabase)
    const allArqData = [...ARQUEOS_HISTORICOS, ...arqs];
    const fromArqs = [];
    allArqData.forEach(a=>{
      Object.keys(a).forEach(k=>{
        if(k.startsWith("efectivo_") && k!=="efectivo_total" && (a[k]||0)>0){
          // Convert field name back to account name
          const nombre = k.replace("efectivo_","").replace(/_/g," ");
          // Find matching account name (case-insensitive)
          const match = [...CUENTAS_DEFAULT,...cuentas,...fromMovs].find(
            c=>c.toLowerCase().replace(/\s+/g,"_") === k.replace("efectivo_","")
          );
          if(match) fromArqs.push(match);
        }
      });
    });
    const all = [...new Set([...cuentas,...fromMovs,...fromArqs])];
    return all;
  },[cuentas, movs, arqs]);

  // Recalculate arqueos from all movements with cascade effect
  const arqsRecalculados = useMemo(()=>{
    // Collect all month IDs
    const mesesSet = new Set([
      ...ARQUEOS_HISTORICOS.map(a=>a.id),
      ...arqs.map(a=>a.id),
      ...movs.map(m=>m.fecha?.slice(0,7)).filter(Boolean),
    ]);
    const meses = [...mesesSet].sort();

    // Group supabase movements by month and account
    const movsByMes = {};
    movs.forEach(m=>{
      const mes = m.fecha?.slice(0,7);
      if(!mes) return;
      if(!movsByMes[mes]) movsByMes[mes]=[];
      movsByMes[mes].push(m);
    });

    // For each account from supabase movements, calculate the NET per month (not cumulative)
    const cuentasFromMovs = [...new Set(movs.map(m=>m.cuenta).filter(Boolean))];
    
    // Calculate net delta per account per month
    const netByMesCuenta = {}; // {mesId: {cuenta: netDelta}}
    movs.forEach(m=>{
      const mes = m.fecha?.slice(0,7);
      if(!mes||!m.cuenta) return;
      if(!netByMesCuenta[mes]) netByMesCuenta[mes]={};
      netByMesCuenta[mes][m.cuenta] = (netByMesCuenta[mes][m.cuenta]||0) + (m.monto_neto||0);
    });

    const result = [];
    // Track running balance per account for new accounts (not in historical)
    const runningNewAccounts = {}; // only for accounts not in historical data

    for(const mesId of meses){
      // Priority 1: Supabase arqueo - enrich with any missing efectivo fields from previous arqueo
      const supaArq = arqs.find(a=>a.id===mesId);
      if(supaArq){
        const prevArq = result[result.length-1];
        const enriched = {...supaArq, capital_invertido: supaArq.capital_invertido ?? supaArq.invertido ?? 0};
        // Copy any efectivo_* fields from previous arqueo that are missing/zero in this one
        if(prevArq){
          Object.keys(prevArq).forEach(k=>{
            if(!k.startsWith("efectivo_")||k==="efectivo_total") return;
            if(!enriched[k] || enriched[k]===0){
              enriched[k] = prevArq[k]||0;
            }
          });
        }
        result.push(enriched);
        continue;
      }

      // Priority 2: historical arqueo — use as-is for existing accounts, add running balance for NEW accounts
      const histArq = ARQUEOS_HISTORICOS.find(a=>a.id===mesId);
      if(histArq){
        const extra = {};
        cuentasFromMovs.forEach(cuenta=>{
          const field = `efectivo_${cuenta.toLowerCase().replace(/\s+/g,"_")}`;
          // Only cascade for accounts that have NO data anywhere in historical arqueos
          const hasAnyHistData = ARQUEOS_HISTORICOS.some(a=>(a[field]||0)>0);
          if(!hasAnyHistData){
            if(runningNewAccounts[cuenta]===undefined) runningNewAccounts[cuenta]=0;
            runningNewAccounts[cuenta] += netByMesCuenta[mesId]?.[cuenta]||0;
            extra[field] = runningNewAccounts[cuenta];
          }
        });
        result.push({...histArq,...extra});
        continue;
      }

      // Priority 3: auto-generate from previous arqueo + monthly net delta
      const prevArq = result[result.length-1];
      const d = new Date(mesId+"-01");
      const autoArq = {
        id: mesId,
        mes: d.toLocaleDateString("es-AR",{month:"short",year:"numeric"}),
        capital_galicia: prevArq?.capital_galicia||0,
        capital_balanz: prevArq?.capital_balanz||0,
        capital_balanz_ccl: prevArq?.capital_balanz_ccl||0,
        capital_invertido: prevArq?.capital_invertido||0,
      };

      // Copy ALL efectivo fields from previous arqueo
      if(prevArq){
        Object.keys(prevArq).forEach(k=>{
          if(k.startsWith("efectivo_") && k!=="efectivo_total"){
            autoArq[k] = prevArq[k]||0;
          }
        });
      }

      // Apply this month's net delta for ALL accounts that had movements
      cuentasFromMovs.forEach(cuenta=>{
        const field = `efectivo_${cuenta.toLowerCase().replace(/\s+/g,"_")}`;
        const prevVal = prevArq?.[field]||0;
        const delta = netByMesCuenta[mesId]?.[cuenta]||0;
        autoArq[field] = prevVal + delta;
      });
      result.push(autoArq);
    }
    return result.sort((a,b)=>a.id<b.id?-1:1);
  },[movs, arqs]);

  // Current month id
  const hoyCurMonthId = (()=>{const n=new Date();return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;})();

  // Merge: use recalculated, exclude current month if no Supabase arqueo for it
  const allArqs = useMemo(()=>{
    const hasCurrentInSupabase = arqs.some(a=>a.id===hoyCurMonthId);
    return arqsRecalculados
      .filter(a=> a.id!==hoyCurMonthId || hasCurrentInSupabase)
      .map(a=>{
        // Sum ALL efectivo_* fields directly from the arqueo object
        const totalEf = Object.keys(a).reduce((s,k)=>{
          if(k.startsWith("efectivo_") && k!=="efectivo_total") return s+(a[k]||0);
          return s;
        }, 0);
        const ef = totalEf || (a.efectivo_galicia||0)+(a.efectivo_balanz||0)+(a.efectivo_balanz_ccl||0);
        const cap = a.capital_invertido ?? a.invertido ?? 0;
        return {
          ...a,
          efectivo_total: ef,
          capital_invertido: cap,
          patrimonio_total: ef + cap,
        };
      });
  },[arqsRecalculados, arqs, hoyCurMonthId]);

  const arqSel = useMemo(()=> arqSelId ? allArqs.find(a=>a.id===arqSelId) : allArqs[allArqs.length-1],[arqSelId,allArqs]);

  useEffect(()=>{
    const fetchCuentas = async()=>{
      const {data} = await supabase.from("cuentas").select("nombre").order("orden",{ascending:true});
      if(data&&data.length>0) setCuentas(data.map(c=>c.nombre));
    };
    fetchCuentas();
  },[]);

  const fetchMovs = useCallback(async()=>{
    const {data} = await supabase.from("movimientos").select("*").order("fecha",{ascending:true});
    // Normalize monto_neto sign: Extraccion and Compra should always be negative
    const normalized = (data||[]).map(m=>{
      let mn = m.monto_neto;
      if(m.tipo_mov==="Extracción" && mn > 0) mn = -mn;
      if(m.tipo_mov==="Compra" && mn > 0) mn = -mn;
      return {...m, monto_neto: mn};
    });
    setMovs(normalized); setLdMovs(false);
  },[]);
  useEffect(()=>{
    fetchMovs();
    const ch = supabase.channel("movs").on("postgres_changes",{event:"*",schema:"public",table:"movimientos"},fetchMovs).subscribe();
    return()=>supabase.removeChannel(ch);
  },[fetchMovs]);

  const fetchArqs = useCallback(async()=>{
    const {data} = await supabase.from("arqueos").select("*").order("fecha_guardado",{ascending:true});
    setArqs(data||[]);
  },[]);
  useEffect(()=>{
    fetchArqs();
    const ch = supabase.channel("arqs").on("postgres_changes",{event:"*",schema:"public",table:"arqueos"},fetchArqs).subscribe();
    return()=>supabase.removeChannel(ch);
  },[fetchArqs]);

  const handleAdd = useCallback(async()=>{
    if(!form.fecha||!form.precio) return;
    setSaving(true);
    const esSoloEfectivo = TIPOS_SIN_ACTIVO.includes(form.tipo_mov);
    const monto_neto = form.tipo_mov==="Compra"
      ? -(parseFloat(form.precio)*(parseFloat(form.cantidad)||1)+parseFloat(form.comision||0))
      : form.tipo_mov==="Extracción"
      ? -parseFloat(form.precio)
      : parseFloat(form.precio);
    const {error} = await supabase.from("movimientos").insert({
      fecha:form.fecha, ticker:esSoloEfectivo?null:(form.ticker||null),
      tipo_activo:esSoloEfectivo?null:(form.tipo_activo||null),
      tipo_mov:form.tipo_mov, cantidad:esSoloEfectivo?null:(parseFloat(form.cantidad)||null),
      precio:parseFloat(form.precio), comision:parseFloat(form.comision)||0,
      monto_neto, cuenta:form.cuenta, comentario:form.comentario||null,
    });
    if(error) alert("Error: "+error.message);
    else { 
      setForm({fecha:"",ticker:"",tipo_activo:"ON",tipo_mov:"Compra",cantidad:"",precio:"",comision:"0",cuenta:cuentas[0]||"Galicia",comentario:""}); 
      setShowForm(false);
      fetchMovs();
    }
    setSaving(false);
  },[form,cuentas]);

  const handleDeleteMov = useCallback(async(id)=>{
    if(!id) return; // hardcoded historical - can't delete
    if(!window.confirm("¿Borrar este movimiento?")) return;
    const {error} = await supabase.from("movimientos").delete().eq("id",id);
    if(error) alert("Error: "+error.message);
  },[]);

  const handleDeleteArq = useCallback(async(id)=>{
    if(!window.confirm("¿Borrar este arqueo?")) return;
    const {error} = await supabase.from("arqueos").delete().eq("id",id);
    if(error) alert("Error: "+error.message);
    else fetchArqs();
  },[fetchArqs]);

  const handleAddCuenta = useCallback(async()=>{
    const nombre = nuevaCuenta.trim();
    if(!nombre||cuentas.includes(nombre)) return;
    await supabase.from("cuentas").insert({nombre,orden:cuentas.length});
    setCuentas(prev=>[...prev,nombre]);
    setNuevaCuenta("");
  },[nuevaCuenta,cuentas]);

  const handleDeleteCuenta = useCallback(async(nombre)=>{
    if(CUENTAS_DEFAULT.includes(nombre)) return;
    await supabase.from("cuentas").delete().eq("nombre",nombre);
    setCuentas(prev=>prev.filter(c=>c!==nombre));
  },[]);

  const allMovs = useMemo(()=>{
    // Use supabase IDs to avoid dedup issues - only dedup truly identical historical records
    const supaKeys = new Set(movs.map(m=>m.id).filter(Boolean));
    // For historical, use a stable unique key including index to avoid false dedup
    const histFiltered = MOVIMIENTOS_HISTORICOS.filter((m,i)=>{
      // Only deduplicate if there's an exact match in supabase by fecha+ticker+tipo_mov+monto_neto+cuenta
      const key = `${m.fecha}|${m.ticker}|${m.tipo_mov}|${m.monto_neto}|${m.cuenta}`;
      return !movs.some(s=>`${s.fecha}|${s.ticker}|${s.tipo_mov}|${s.monto_neto}|${s.cuenta}`===key);
    });
    return [...histFiltered,...movs].sort((a,b)=>a.fecha<b.fecha?-1:1);
  },[movs]);

  const tipoMovsUnicos = useMemo(()=>[...new Set(allMovs.map(m=>m.tipo_mov).filter(Boolean))].sort(),[allMovs]);

  const movsDisplay = useMemo(()=>{
    return allMovs.filter(m=>{
      if(filtros.fechaDesde && m.fecha < filtros.fechaDesde) return false;
      if(filtros.fechaHasta && m.fecha > filtros.fechaHasta) return false;
      if(filtros.cuenta && m.cuenta !== filtros.cuenta) return false;
      if(filtros.tipo_mov && m.tipo_mov !== filtros.tipo_mov) return false;
      if(filtros.ticker && !(m.ticker?.toLowerCase().includes(filtros.ticker.toLowerCase()))) return false;
      return true;
    }).reverse().slice(0,200);
  },[allMovs,filtros]);

  const histTicker = useMemo(()=>{
    if(!tickerAbierto) return [];
    return allMovs.filter(m=>m.ticker?.toUpperCase()===tickerAbierto.toUpperCase())
      .filter(m=>["Compra","Venta","Venta parcial","Cupón / interés"].includes(m.tipo_mov))
      .sort((a,b)=>a.fecha<b.fecha?-1:1);
  },[allMovs,tickerAbierto]);

  const sortPos = useCallback((key)=>{
    setSortConfig(prev=>({key, dir: prev.key===key && prev.dir==="desc" ? "asc" : "desc"}));
  },[]);

  // ── POSICIONES DINÁMICAS desde allMovs ──────────────────────────────────────
  const posicionesCalculadas = useMemo(()=>{
    // Group all movements by ticker (only investment movements)
    const byTicker = {};
    allMovs.forEach(m=>{
      if(!m.ticker || ["Depósito","Extracción","Transferencia"].includes(m.tipo_mov)) return;
      if(!byTicker[m.ticker]) byTicker[m.ticker]={movs:[]};
      byTicker[m.ticker].movs.push(m);
    });

    const abiertas = [];
    const cerradasNuevas = []; // tickers not in POSICIONES_CERRADAS hardcoded

    Object.entries(byTicker).forEach(([ticker, {movs:tmovs}])=>{
      // Get static info for tipo
      const staticAbierta = POSICIONES_ABIERTAS.find(p=>p.ticker===ticker);
      const staticCerrada = POSICIONES_CERRADAS.find(p=>p.ticker===ticker);
      const tipo = staticAbierta?.tipo || staticCerrada?.tipo?.replace("Obligación Negociable","ON") || "ON";

      let qty = 0;
      let capitalInvertidoActual = 0; // net cash deployed (compras - ventas a precio de compra)
      let costoTotalCompras = 0;      // total spent on buys
      let cantidadComprada = 0;
      let resultado_realizado = 0;
      let intereses = 0;
      let comisiones = 0;

      // Sort by date
      const sorted = [...tmovs].sort((a,b)=>a.fecha<b.fecha?-1:1);

      sorted.forEach(m=>{
        const monto = Math.abs(m.monto_neto||0);
        const cant = m.cantidad||0;
        const com = m.comision||0;

        if(m.tipo_mov==="Compra"){
          qty += cant;
          cantidadComprada += cant;
          costoTotalCompras += monto;
          comisiones += com;
        } else if(m.tipo_mov==="Venta" || m.tipo_mov==="Venta parcial"){
          // Precio promedio actual al momento de la venta
          const precioProm = qty > 0 ? costoTotalCompras / qty : 0;
          const costoVenta = cant * precioProm;
          const ingresoVenta = monto;
          resultado_realizado += ingresoVenta - costoVenta;
          // Reduce remaining cost basis proportionally
          costoTotalCompras = Math.max(0, costoTotalCompras - costoVenta);
          qty = Math.max(0, qty - cant);
        } else if(m.tipo_mov==="Cupón / interés"){
          intereses += monto;
        }
      });

      // Capital actual = costo base restante (lo que realmente tenés invertido hoy)
      const precio_prom = qty > 0 ? costoTotalCompras / qty : 0;
      const capital = costoTotalCompras;
      const resultado_total = resultado_realizado + intereses - comisiones;
      const rendimiento = costoTotalCompras > 0 ? resultado_total / costoTotalCompras : 0;

      const pos = {
        ticker, tipo,
        qty: Math.round(qty),
        precio_prom,
        capital,
        comisiones,
        resultado_realizado,
        intereses,
        resultado_total,
        rendimiento,
      };

      if(qty > 0.01){
        abiertas.push(pos);
      } else {
        // Only add to cerradas if not already in hardcoded list
        if(!staticCerrada){
          cerradasNuevas.push({
            ...pos,
            qty_comprada: cantidadComprada,
          });
        }
      }
    });

    return {abiertas, cerradasNuevas};
  },[allMovs]);

  const posAbiertas = useMemo(()=>{
    const filtered = posicionesCalculadas.abiertas.filter(p=>
      p.ticker.toLowerCase().includes(search.toLowerCase())
    );
    return [...filtered].sort((a,b)=>{
      const v = sortConfig.dir==="asc" ? 1 : -1;
      const av = a[sortConfig.key]??0, bv = b[sortConfig.key]??0;
      if(typeof av==="string") return av.localeCompare(bv)*v;
      return (av-bv)*v;
    });
  },[posicionesCalculadas, search, sortConfig]);

  const posCerradas = useMemo(()=>{
    // Merge hardcoded cerradas + dynamically calculated new ones
    const allCerradas = [
      ...POSICIONES_CERRADAS.map(p=>({...p, tipo: p.tipo.replace("Obligación Negociable","ON")})),
      ...posicionesCalculadas.cerradasNuevas,
    ];
    const filtered = allCerradas.filter(p=>p.ticker.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a,b)=>{
      const v = sortConfig.dir==="asc" ? 1 : -1;
      const av = a[sortConfig.key]??0, bv = b[sortConfig.key]??0;
      if(typeof av==="string") return av.localeCompare(bv)*v;
      return (av-bv)*v;
    });
  },[posicionesCalculadas, search, sortConfig]);

  // Dynamic totals from calculated positions
  const totalCapitalInvertido = useMemo(()=>
    posAbiertas.reduce((s,p)=>s+p.capital,0)
  ,[posAbiertas]);

  // Saldos actuales por cuenta = hardcodeado feb 2026 + movimientos Supabase posteriores
  const saldosPorCuenta = useMemo(()=>{
    const toCol = name => `efectivo_${name.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")}`;
    const saldos = {};
    const lastHist = ARQUEOS_HISTORICOS[ARQUEOS_HISTORICOS.length-1];
    if(lastHist){
      todasCuentas.forEach(c=>{ saldos[c] = lastHist[toCol(c)] || 0; });
      const lastDate = lastHist.id;
      movs.forEach(m=>{
        if(!m.cuenta||!m.fecha) return;
        if(m.fecha.substring(0,7)<=lastDate) return;
        if(!saldos.hasOwnProperty(m.cuenta)) saldos[m.cuenta]=0;
        saldos[m.cuenta]+=(m.monto_neto||0);
      });
    }
    return saldos;
  },[movs, todasCuentas]);

  const totalEfectivoDisponible = useMemo(()=>
    Object.values(saldosPorCuenta).reduce((s,v)=>s+v,0)
  ,[saldosPorCuenta]);

  const handleArqueo = useCallback(async()=>{
    if(!arqFecha) return alert("Seleccioná una fecha para el arqueo.");
    const d = new Date(arqFecha+"T12:00:00");
    const mes = d.toLocaleDateString("es-AR",{month:"short",year:"numeric"});
    const id = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    const toCol = name => `efectivo_${name.toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"")}`;
    const efectivoFields = {};
    Object.entries(saldosPorCuenta).forEach(([cuenta,saldo])=>{ efectivoFields[toCol(cuenta)]=saldo; });
    const totalEf = Object.values(saldosPorCuenta).reduce((s,v)=>s+v,0);
    const hist = ARQUEOS_HISTORICOS.find(a=>a.id===id)||ARQUEOS_HISTORICOS[ARQUEOS_HISTORICOS.length-1];
    const {error} = await supabase.from("arqueos").upsert({
      id, mes,
      patrimonio: totalEf+totalCapitalInvertido,
      resultado: posAbiertas.reduce((s,p)=>s+p.resultado_total,0)+posCerradas.reduce((s,p)=>s+(p.resultado_total||0),0),
      saldo_efectivo: totalEf, invertido: totalCapitalInvertido,
      ...efectivoFields,
      capital_galicia: hist?.capital_galicia??0,
      capital_balanz: hist?.capital_balanz??0,
      capital_balanz_ccl: hist?.capital_balanz_ccl??0,
      capital_invertido: totalCapitalInvertido,
      fecha_guardado: d.toISOString(),
    });
    if(error) alert("Error: "+error.message);
    else { setMsg(`✓ Arqueo ${mes} guardado`); setTimeout(()=>setMsg(""),3000); fetchArqs(); }
  },[arqFecha,fetchArqs,saldosPorCuenta,totalCapitalInvertido,posAbiertas,posCerradas]);

  const pieData = [
    {name:"ONs", value: posAbiertas.filter(p=>p.tipo==="ON").reduce((s,p)=>s+p.capital,0)},
    {name:"Acciones", value: posAbiertas.filter(p=>p.tipo==="Acción").reduce((s,p)=>s+p.capital,0)},
    {name:"Efectivo", value: totalEfectivoDisponible},
  ];

  const esSoloEfectivo = TIPOS_SIN_ACTIVO.includes(form.tipo_mov);

  return (
    <div style={S}>
      <div style={{background:"linear-gradient(135deg,#1a1408,#0d0b06)",borderBottom:"1px solid #3a3010",padding:"18px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:20,fontWeight:"bold",color:"#d4a843",letterSpacing:"0.05em"}}>📈 Portfolio</div>
          <div style={{fontSize:11,color:"#8b7c4a",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Seguimiento de Inversiones · Supabase ⚡</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[["dashboard","Dashboard"],["posiciones","Posiciones"],["movimientos","Movimientos"],["arqueos","Arqueos"],["config","⚙ Cuentas"]].map(([k,v])=>(
            <button key={k} onClick={()=>{setTab(k);setSearch("");}} style={btn(tab===k)}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"24px 28px",maxWidth:1300,margin:"0 auto"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[
                {label:"Patrimonio Total",value:f$(totalEfectivoDisponible+totalCapitalInvertido),sub:"activos + efectivo",color:"#d4a843",click:null},
                {label:"Efectivo Disponible",value:f$(totalEfectivoDisponible),sub:"click para ver detalle ↓",color:"#7ec87e",click:()=>setShowEfectivo(v=>!v)},
                {label:"Capital Invertido",value:f$(totalCapitalInvertido),sub:"en posiciones abiertas",color:"#c8a96e",click:null},
                {label:"Resultado Total",value:f$(posAbiertas.reduce((s,p)=>s+p.resultado_total,0)+posCerradas.reduce((s,p)=>s+(p.resultado_total||0),0)),sub:"realizado + intereses",color:"#7ec87e",click:null},
              ].map((c,i)=>(
                <div key={i} onClick={c.click||undefined} style={{...card,cursor:c.click?"pointer":"default",border:c.click&&showEfectivo?"1px solid #7ec87e":"1px solid #3a3010"}}>
                  <div style={{fontSize:11,color:"#8b7c4a",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{c.label}</div>
                  <div style={{fontSize:24,fontWeight:"bold",color:c.color,marginBottom:4}}>{c.value}</div>
                  <div style={{fontSize:12,color:"#5a4a2a"}}>{c.sub}</div>
                </div>
              ))}
            </div>

            {/* Desglose efectivo por cuenta */}
            {showEfectivo&&(()=>{
              const CUENTA_COLORS = ["#d4a843","#2196f3","#e74c3c","#7ec87e","#c878e8","#f39c12","#1abc9c"];
              // Use live saldosPorCuenta (last arqueo + movements after)
              const rows = Object.entries(saldosPorCuenta)
                .filter(([,v])=>v>0)
                .map(([label,value],i)=>({label,value,color:CUENTA_COLORS[i%CUENTA_COLORS.length]}));
              return (
                <div style={{background:"#1a1a08",border:"1px solid #7ec87e",borderRadius:12,padding:"16px 20px",marginBottom:20,display:"flex",gap:28,alignItems:"center",flexWrap:"wrap"}}>
                  <div style={{fontSize:12,color:"#8b7c4a",textTransform:"uppercase",letterSpacing:"0.07em"}}>💵 Efectivo por cuenta</div>
                  {rows.map((r,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:r.color}}/>
                      <span style={{color:"#c8a96e",fontSize:13}}>{r.label}</span>
                      <span style={{color:r.color,fontWeight:"bold",fontSize:15}}>{f$(r.value)}</span>
                    </div>
                  ))}
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
                    <span style={{color:"#8b7c4a",fontSize:12}}>Total</span>
                    <span style={{color:"#7ec87e",fontWeight:"bold",fontSize:16}}>{f$(rows.reduce((s,r)=>s+r.value,0))}</span>
                  </div>
                </div>
              );
            })()}
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20,marginBottom:20}}>
              <div style={{...tbl,padding:20}}>
                <div style={{fontSize:12,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>Patrimonio mensual — Efectivo + Invertido</div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={allArqs}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2196f3" stopOpacity={0.4}/><stop offset="95%" stopColor="#2196f3" stopOpacity={0}/></linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#d4a843" stopOpacity={0.4}/><stop offset="95%" stopColor="#d4a843" stopOpacity={0}/></linearGradient>
                      <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7ec87e" stopOpacity={0.15}/><stop offset="95%" stopColor="#7ec87e" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2010"/>
                    <XAxis dataKey="mes" tick={{fill:"#5a4a2a",fontSize:9}} interval={2}/>
                    <YAxis tick={{fill:"#5a4a2a",fontSize:9}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                    <Tooltip contentStyle={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:8}} formatter={v=>[f$(v),""]}/>
                    <Legend formatter={v=><span style={{color:v==="Efectivo"?"#2196f3":v==="Invertido"?"#d4a843":"#7ec87e",fontSize:11}}>{v}</span>}/>
                    <Area type="monotone" dataKey="efectivo_total" stackId="1" stroke="#2196f3" fill="url(#g1)" strokeWidth={2} name="Efectivo"/>
                    <Area type="monotone" dataKey="capital_invertido" stackId="1" stroke="#d4a843" fill="url(#g2)" strokeWidth={2} name="Invertido"/>
                    <Area type="monotone" dataKey="patrimonio_total" stackId="2" stroke="#7ec87e" fill="url(#g3)" strokeWidth={2} strokeDasharray="5 3" name="Patrimonio"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{...tbl,padding:20}}>
                <div style={{fontSize:12,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>Distribución actual</div>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" paddingAngle={4}>
                      {pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip contentStyle={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:8}} formatter={v=>[f$(v),""]}/>
                    <Legend formatter={(v,e)=><span style={{color:PIE_COLORS[e.payload.index]||"#c8a96e",fontSize:11,fontWeight:"bold"}}>{v}</span>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <div style={{...tbl,padding:20}}>
                <div style={{fontSize:12,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>Resultado — posiciones abiertas</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={POSICIONES_ABIERTAS.filter(p=>p.resultado_total!==0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2010"/>
                    <XAxis dataKey="ticker" tick={{fill:"#5a4a2a",fontSize:9}}/>
                    <YAxis tick={{fill:"#5a4a2a",fontSize:9}} tickFormatter={v=>`$${v.toFixed(0)}`}/>
                    <Tooltip contentStyle={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:8}} formatter={v=>[f$(v),"Resultado"]}/>
                    <Bar dataKey="resultado_total" radius={[4,4,0,0]}>
                      {POSICIONES_ABIERTAS.filter(p=>p.resultado_total!==0).map((p,i)=><Cell key={i} fill={p.resultado_total>=0?"#7ec87e":"#e87c7c"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{...tbl,padding:20}}>
                <div style={{fontSize:12,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>Top 10 cerradas</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={[...POSICIONES_CERRADAS].sort((a,b)=>b.resultado_total-a.resultado_total).slice(0,10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2010"/>
                    <XAxis dataKey="ticker" tick={{fill:"#5a4a2a",fontSize:9}}/>
                    <YAxis tick={{fill:"#5a4a2a",fontSize:9}} tickFormatter={v=>`$${v.toFixed(0)}`}/>
                    <Tooltip contentStyle={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:8}} formatter={v=>[f$(v),"Resultado"]}/>
                    <Bar dataKey="resultado_total" radius={[4,4,0,0]}>
                      {[...POSICIONES_CERRADAS].sort((a,b)=>b.resultado_total-a.resultado_total).slice(0,10).map((p,i)=><Cell key={i} fill={p.resultado_total>=0?"#7ec87e":"#e87c7c"}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── POSICIONES ── */}
        {tab==="posiciones"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{fontSize:18,color:"#d4a843",marginRight:8}}>Posiciones</div>
                <button onClick={()=>setPosTab("abiertas")} style={btn(posTab==="abiertas")}>Abiertas ({POSICIONES_ABIERTAS.length})</button>
                <button onClick={()=>setPosTab("cerradas")} style={btn(posTab==="cerradas")}>Cerradas ({POSICIONES_CERRADAS.length})</button>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#8b7c4a"}}>Ordenar:</span>
                {[["ticker","Nombre"],["tipo","Tipo"],["capital","Capital"],["resultado_total","Resultado"],["rendimiento","Rend."]].map(([k,l])=>(
                  <button key={k} onClick={()=>sortPos(k)} style={btn(sortConfig.key===k,{padding:"4px 10px",fontSize:11})}>
                    {l}{sortConfig.key===k?(sortConfig.dir==="desc"?" ↓":" ↑"):""}
                  </button>
                ))}
                <input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:140,marginLeft:4}}/>
              </div>
            </div>
            {posTab==="abiertas"&&(
              <div style={tbl}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:"#1a1408"}}>{["Ticker","Tipo","Cantidad","P. Prom.","Capital Inv.","Res. Real.","Intereses","Comisiones","Total","Rend."].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {posAbiertas.map((p,i)=>(
                      <>
                        <tr key={i} onClick={()=>setTickerAbierto(tickerAbierto===p.ticker?null:p.ticker)} style={{borderBottom:"1px solid #1a1408",background:tickerAbierto===p.ticker?"#1e1a08":i%2===0?"transparent":"#0f0d04",cursor:"pointer"}}>
                          <td style={TD({color:"#d4a843",fontWeight:"bold"})}>
                            <span style={{marginRight:6,fontSize:10,color:"#8b7c4a"}}>{tickerAbierto===p.ticker?"▼":"▶"}</span>{p.ticker}
                          </td>
                          <td style={TD({color:"#c8a96e"})}>{p.tipo}</td>
                          <td style={TD()}>{p.qty.toLocaleString("es-AR")}</td>
                          <td style={TD()}>{p.precio_prom.toFixed(4)}</td>
                          <td style={TD()}>{f$(p.capital)}</td>
                          <td style={TD({color:p.resultado_realizado>=0?"#7ec87e":"#e87c7c"})}>{f$(p.resultado_realizado)}</td>
                          <td style={TD({color:"#c8a96e"})}>{f$(p.intereses)}</td>
                          <td style={TD({color:"#e87c7c"})}>{f$(p.comisiones||0)}</td>
                          <td style={TD({color:p.resultado_total>=0?"#7ec87e":"#e87c7c",fontWeight:"bold"})}>{f$(p.resultado_total)}</td>
                          <td style={TD({color:p.rendimiento>=0?"#7ec87e":"#e87c7c"})}>{fPct(p.rendimiento*100)}</td>
                        </tr>
                        {tickerAbierto===p.ticker&&(
                          <tr key={`hist-${i}`}>
                            <td colSpan={10} style={{padding:"0 0 4px 0",background:"#0d0f05"}}>
                              <div style={{padding:"14px 20px",borderBottom:"2px solid #3a3010"}}>
                                <div style={{fontSize:11,color:"#8b7c4a",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                                  Historial — {p.ticker}
                                  {histTicker.length===0&&<span style={{color:"#5a4a2a",marginLeft:8}}>Sin movimientos registrados</span>}
                                </div>
                                {histTicker.length>0&&(
                                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                                    <thead><tr style={{background:"#1a1408"}}>
                                      {["Fecha","Movimiento","Cantidad","Precio","Comisión","Monto Neto","Cuenta"].map(h=><th key={h} style={{...TH,padding:"8px 12px",fontSize:10}}>{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                      {histTicker.map((m,j)=>{const{bg,c}=mcol(m.tipo_mov);return(
                                        <tr key={j} style={{borderBottom:"1px solid #1a1408",background:j%2===0?"#0f0d04":"transparent"}}>
                                          <td style={{...TD({color:"#8b7c4a"}),padding:"8px 12px"}}>{m.fecha}</td>
                                          <td style={{...TD(),padding:"8px 12px"}}><span style={{padding:"2px 7px",borderRadius:4,fontSize:10,background:bg,color:c}}>{m.tipo_mov}</span></td>
                                          <td style={{...TD(),padding:"8px 12px"}}>{m.cantidad?Number(m.cantidad).toLocaleString("es-AR"):"—"}</td>
                                          <td style={{...TD(),padding:"8px 12px"}}>{m.precio?Number(m.precio).toFixed(4):"—"}</td>
                                          <td style={{...TD({color:"#8b7c4a"}),padding:"8px 12px"}}>{m.comision?f$(m.comision):"—"}</td>
                                          <td style={{...TD({fontWeight:"bold",color:m.monto_neto>=0?"#7ec87e":"#e87c7c"}),padding:"8px 12px"}}>{f$(m.monto_neto)}</td>
                                          <td style={{...TD({color:"#c8a96e"}),padding:"8px 12px"}}>{m.cuenta||"—"}</td>
                                        </tr>
                                      );})}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                  <tfoot><tr style={{background:"#1a1408",borderTop:"1px solid #3a3010"}}>
                    <td colSpan={4} style={TD({color:"#8b7c4a",fontSize:11,textTransform:"uppercase"})}>Total</td>
                    <td style={TD({color:"#d4a843",fontWeight:"bold"})}>{f$(posAbiertas.reduce((s,p)=>s+p.capital,0))}</td>
                    <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(POSICIONES_ABIERTAS.reduce((s,p)=>s+p.resultado_realizado,0))}</td>
                    <td style={TD({color:"#c8a96e",fontWeight:"bold"})}>{f$(POSICIONES_ABIERTAS.reduce((s,p)=>s+p.intereses,0))}</td>
                    <td style={TD({color:"#e87c7c",fontWeight:"bold"})}>{f$(POSICIONES_ABIERTAS.reduce((s,p)=>s+(p.comisiones||0),0))}</td>
                    <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(POSICIONES_ABIERTAS.reduce((s,p)=>s+p.resultado_total,0))}</td>
                    <td/>
                  </tr></tfoot>
                </table>
              </div>
            )}
            {posTab==="cerradas"&&(
              <div style={tbl}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:"#1a1408"}}>{["Ticker","Tipo","Cant. Comprada","Capital","Res. Realizado","Intereses","Comisiones","Total","Rend."].map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {posCerradas.map((p,i)=>(
                      <>
                        <tr key={i} onClick={()=>setTickerAbierto(tickerAbierto===p.ticker?null:p.ticker)} style={{borderBottom:"1px solid #1a1408",background:tickerAbierto===p.ticker?"#1e1a08":i%2===0?"transparent":"#0f0d04",cursor:"pointer"}}>
                          <td style={TD({color:"#d4a843",fontWeight:"bold"})}>
                            <span style={{marginRight:6,fontSize:10,color:"#8b7c4a"}}>{tickerAbierto===p.ticker?"▼":"▶"}</span>{p.ticker}
                          </td>
                          <td style={TD({color:"#c8a96e"})}>{p.tipo?.replace("Obligación Negociable","ON")}</td>
                          <td style={TD()}>{(p.qty_comprada||0).toLocaleString("es-AR")}</td>
                          <td style={TD()}>{f$(p.capital)}</td>
                          <td style={TD({color:p.resultado_realizado>=0?"#7ec87e":"#e87c7c"})}>{f$(p.resultado_realizado)}</td>
                          <td style={TD({color:"#c8a96e"})}>{f$(p.intereses)}</td>
                          <td style={TD({color:"#8b7c4a"})}>{f$(p.comisiones)}</td>
                          <td style={TD({color:p.resultado_total>=0?"#7ec87e":"#e87c7c",fontWeight:"bold"})}>{f$(p.resultado_total)}</td>
                          <td style={TD({color:p.rendimiento>=0?"#7ec87e":"#e87c7c"})}>{fPct(p.rendimiento*100)}</td>
                        </tr>
                        {tickerAbierto===p.ticker&&(
                          <tr key={`hist-c-${i}`}>
                            <td colSpan={9} style={{padding:"0 0 4px 0",background:"#0d0f05"}}>
                              <div style={{padding:"14px 20px",borderBottom:"2px solid #3a3010"}}>
                                <div style={{fontSize:11,color:"#8b7c4a",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>
                                  Historial de movimientos — {p.ticker}
                                  {histTicker.length===0&&<span style={{color:"#5a4a2a",marginLeft:8}}>Sin movimientos registrados</span>}
                                </div>
                                {histTicker.length>0&&(
                                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                                    <thead><tr style={{background:"#1a1408"}}>
                                      {["Fecha","Movimiento","Cantidad","Precio","Comisión","Monto Neto","Cuenta"].map(h=><th key={h} style={{...TH,padding:"8px 12px",fontSize:10}}>{h}</th>)}
                                    </tr></thead>
                                    <tbody>
                                      {histTicker.map((m,j)=>{const{bg,c}=mcol(m.tipo_mov);return(
                                        <tr key={j} style={{borderBottom:"1px solid #1a1408",background:j%2===0?"#0f0d04":"transparent"}}>
                                          <td style={{...TD({color:"#8b7c4a"}),padding:"8px 12px"}}>{m.fecha}</td>
                                          <td style={{...TD(),padding:"8px 12px"}}><span style={{padding:"2px 7px",borderRadius:4,fontSize:10,background:bg,color:c}}>{m.tipo_mov}</span></td>
                                          <td style={{...TD(),padding:"8px 12px"}}>{m.cantidad?Number(m.cantidad).toLocaleString("es-AR"):"—"}</td>
                                          <td style={{...TD(),padding:"8px 12px"}}>{m.precio?Number(m.precio).toFixed(4):"—"}</td>
                                          <td style={{...TD({color:"#8b7c4a"}),padding:"8px 12px"}}>{m.comision?f$(m.comision):"—"}</td>
                                          <td style={{...TD({fontWeight:"bold",color:m.monto_neto>=0?"#7ec87e":"#e87c7c"}),padding:"8px 12px"}}>{f$(m.monto_neto)}</td>
                                          <td style={{...TD({color:"#c8a96e"}),padding:"8px 12px"}}>{m.cuenta||"—"}</td>
                                        </tr>
                                      );})}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                  <tfoot><tr style={{background:"#1a1408",borderTop:"1px solid #3a3010"}}>
                    <td colSpan={3} style={TD({color:"#8b7c4a",fontSize:11,textTransform:"uppercase"})}>Total ({POSICIONES_CERRADAS.length})</td>
                    <td style={TD({color:"#d4a843",fontWeight:"bold"})}>{f$(POSICIONES_CERRADAS.reduce((s,p)=>s+(p.capital||0),0))}</td>
                    <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(POSICIONES_CERRADAS.reduce((s,p)=>s+(p.resultado_realizado||0),0))}</td>
                    <td style={TD({color:"#c8a96e",fontWeight:"bold"})}>{f$(POSICIONES_CERRADAS.reduce((s,p)=>s+(p.intereses||0),0))}</td>
                    <td style={TD({color:"#8b7c4a",fontWeight:"bold"})}>{f$(POSICIONES_CERRADAS.reduce((s,p)=>s+(p.comisiones||0),0))}</td>
                    <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(POSICIONES_CERRADAS.reduce((s,p)=>s+(p.resultado_total||0),0))}</td>
                    <td/>
                  </tr></tfoot>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MOVIMIENTOS ── */}
        {tab==="movimientos"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontSize:18,color:"#d4a843"}}>Historial de Movimientos</div>
                {!ldMovs&&<div style={{fontSize:11,color:"#5a4a2a",marginTop:2}}>{allMovs.length} movimientos totales · ⚡</div>}
              </div>
              <button onClick={()=>setShowForm(!showForm)} style={{background:"#2a1f08",border:"1px solid #d4a843",color:"#d4a843",padding:"8px 18px",borderRadius:8,fontSize:13,cursor:"pointer"}}>{showForm?"✕ Cancelar":"+ Nuevo"}</button>
            </div>

            {/* Filtros */}
            <div style={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:10,padding:"14px 16px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr auto",gap:10,alignItems:"end"}}>
              <div>
                <label style={lbl}>Desde</label>
                <input type="date" value={filtros.fechaDesde} onChange={e=>setFiltros(f=>({...f,fechaDesde:e.target.value}))} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Hasta</label>
                <input type="date" value={filtros.fechaHasta} onChange={e=>setFiltros(f=>({...f,fechaHasta:e.target.value}))} style={inp}/>
              </div>
              <div>
                <label style={lbl}>Cuenta</label>
                <select value={filtros.cuenta} onChange={e=>setFiltros(f=>({...f,cuenta:e.target.value}))} style={inp}>
                  <option value="">Todas</option>
                  {todasCuentas.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Tipo</label>
                <select value={filtros.tipo_mov} onChange={e=>setFiltros(f=>({...f,tipo_mov:e.target.value}))} style={inp}>
                  <option value="">Todos</option>
                  {tipoMovsUnicos.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Ticker</label>
                <input value={filtros.ticker} onChange={e=>setFiltros(f=>({...f,ticker:e.target.value.toUpperCase()}))} placeholder="ej: AL30D" style={inp}/>
              </div>
              <button onClick={()=>setFiltros({fechaDesde:"",fechaHasta:"",cuenta:"",tipo_mov:"",ticker:""})} style={{...btn(false),padding:"8px 14px",whiteSpace:"nowrap",height:36}}>✕ Limpiar</button>
            </div>

            {showForm&&(
              <div style={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:12,padding:20,marginBottom:20}}>
                <div style={{fontSize:14,color:"#d4a843",marginBottom:16}}>Registrar Movimiento</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:12}}>
                  <div><label style={lbl}>Fecha</label><input type="date" value={form.fecha} onChange={e=>setForm(p=>({...p,fecha:e.target.value}))} style={inp}/></div>
                  <div><label style={lbl}>Movimiento</label>
                    <select value={form.tipo_mov} onChange={e=>setForm(p=>({...p,tipo_mov:e.target.value}))} style={inp}>
                      <option>Compra</option><option>Venta</option><option>Venta parcial</option><option>Cupón / interés</option><option>Depósito</option><option>Extracción</option><option>Transferencia</option>
                    </select>
                  </div>
                  {!esSoloEfectivo&&<div><label style={lbl}>Ticker</label><input value={form.ticker} onChange={e=>setForm(p=>({...p,ticker:e.target.value.toUpperCase()}))} placeholder="ej: AL30D" style={inp}/></div>}
                  {!esSoloEfectivo&&<div><label style={lbl}>Tipo Activo</label>
                    <select value={form.tipo_activo} onChange={e=>setForm(p=>({...p,tipo_activo:e.target.value}))} style={inp}>
                      <option>ON</option><option>Bono</option><option>Acción</option>
                    </select>
                  </div>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:14}}>
                  {!esSoloEfectivo&&<div><label style={lbl}>Cantidad</label><input type="number" value={form.cantidad} onChange={e=>setForm(p=>({...p,cantidad:e.target.value}))} style={inp}/></div>}
                  <div><label style={lbl}>{esSoloEfectivo?"Monto":"Precio / Monto"}</label><input type="number" value={form.precio} onChange={e=>setForm(p=>({...p,precio:e.target.value}))} style={inp}/></div>
                  {!esSoloEfectivo&&<div><label style={lbl}>Comisión</label><input type="number" value={form.comision} onChange={e=>setForm(p=>({...p,comision:e.target.value}))} style={inp}/></div>}
                  <div><label style={lbl}>Cuenta</label>
                    <select value={form.cuenta} onChange={e=>setForm(p=>({...p,cuenta:e.target.value}))} style={inp}>
                      {todasCuentas.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <input value={form.comentario} onChange={e=>setForm(p=>({...p,comentario:e.target.value}))} placeholder="Comentario (opcional)" style={{...inp,flex:1}}/>
                  <button onClick={handleAdd} disabled={saving} style={{background:saving?"#5a4a2a":"#d4a843",color:"#0d0b06",padding:"8px 24px",borderRadius:8,fontSize:13,fontWeight:"bold",cursor:"pointer",border:"none",minWidth:100}}>{saving?"Guardando...":"Guardar"}</button>
                </div>
              </div>
            )}

            <div style={tbl}>
              {(()=>{
                const showSaldo = !!filtros.cuenta;
                // Calculate running saldo using ALL movements of that account (not just filtered)
                // so the balance is always correct regardless of date filters
                const saldos = [];
                if(showSaldo){
                  // Build cumulative saldo map: for each movement id/key, what was the saldo AFTER it
                  const cuentaMovs = allMovs
                    .filter(m=>m.cuenta===filtros.cuenta)
                    .sort((a,b)=>a.fecha<b.fecha?-1:a.fecha>b.fecha?1:0);
                  let bal = 0;
                  const saldoMap = new Map();
                  cuentaMovs.forEach(m=>{
                    bal += (m.monto_neto||0);
                    // key: use id if available, else fecha+monto_neto
                    const key = m.id || `${m.fecha}|${m.monto_neto}|${m.tipo_mov}`;
                    saldoMap.set(key, bal);
                  });
                  // Map saldos to movsDisplay order (newest first)
                  movsDisplay.forEach(m=>{
                    const key = m.id || `${m.fecha}|${m.monto_neto}|${m.tipo_mov}`;
                    saldos.push(saldoMap.get(key) ?? null);
                  });
                }
                const headers = ["Fecha","Ticker","Tipo","Movimiento","Cantidad","Precio","Comisión","Monto Neto","Cuenta",showSaldo?"Saldo":"Comentario",""];
                return (
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:"#1a1408"}}>{headers.map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                  <tbody>
                    {movsDisplay.length===0
                      ?<tr><td colSpan={11} style={{textAlign:"center",padding:40,color:"#5a4a2a"}}>
                        No hay movimientos{(filtros.fechaDesde||filtros.fechaHasta||filtros.cuenta||filtros.tipo_mov||filtros.ticker)?" con los filtros activos — probá limpiar los filtros":"."}</td></tr>
                      :movsDisplay.map((m,i)=>{const{bg,c}=mcol(m.tipo_mov);return(
                        <tr key={m.id||i} style={{borderBottom:"1px solid #1a1408",background:i%2===0?"transparent":"#0f0d04"}}>
                          <td style={TD({color:"#8b7c4a",whiteSpace:"nowrap"})}>{m.fecha}</td>
                          <td style={TD({color:"#d4a843",fontWeight:"bold"})}>{m.ticker||"—"}</td>
                          <td style={TD({color:"#c8a96e"})}>{m.tipo_activo?.replace("Obligación Negociable","ON")||"—"}</td>
                          <td style={TD()}><span style={{padding:"2px 8px",borderRadius:4,fontSize:11,background:bg,color:c}}>{m.tipo_mov}</span></td>
                          <td style={TD()}>{m.cantidad?Number(m.cantidad).toLocaleString("es-AR"):"—"}</td>
                          <td style={TD()}>{m.precio?Number(m.precio).toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:6}):"—"}</td>
                          <td style={TD({color:"#8b7c4a"})}>{m.comision?f$(m.comision):"—"}</td>
                          <td style={TD({fontWeight:"bold",color:m.monto_neto>=0?"#7ec87e":"#e87c7c"})}>{f$(m.monto_neto)}</td>
                          <td style={TD({color:"#c8a96e"})}>{m.cuenta||"—"}</td>
                          <td style={TD({color:showSaldo?(saldos[i]>=0?"#7ec87e":"#e87c7c"):"#5a4a2a",fontWeight:showSaldo?"bold":"normal",fontSize:showSaldo?13:11})}>
                            {showSaldo ? f$(saldos[i]) : (m.comentario||"")}
                          </td>
                          <td style={TD()}>{m.id&&<button onClick={e=>{e.stopPropagation();handleDeleteMov(m.id);}} style={{background:"transparent",border:"1px solid #3a1a1a",color:"#e87c7c",padding:"2px 8px",borderRadius:4,fontSize:11,cursor:"pointer"}}>✕</button>}</td>
                        </tr>
                      );})}
                  </tbody>
                </table>
                );
              })()}
              <div style={{padding:"10px 16px",borderTop:"1px solid #2a2010",color:"#5a4a2a",fontSize:11}}>
                Mostrando {movsDisplay.length} resultados
              </div>
            </div>
          </div>
        )}

        {/* ── ARQUEOS ── */}
        {tab==="arqueos"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div>
                <div style={{fontSize:18,color:"#d4a843"}}>Arqueos Mensuales</div>
                <div style={{fontSize:12,color:"#5a4a2a",marginTop:3}}>{allArqs.length} arqueos · histórico desde {allArqs[0]?.mes}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {msg&&<span style={{color:"#7ec87e",fontSize:13}}>{msg}</span>}
                <input type="date" value={arqFecha} onChange={e=>setArqFecha(e.target.value)} style={{...inp,width:160}}/>
                <button onClick={()=>{const h=new Date();setArqFecha(`${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`);}} style={{background:"#1a2a10",border:"1px solid #7ec87e",color:"#7ec87e",padding:"9px 14px",borderRadius:8,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}>📅 Hoy</button>
                <button onClick={handleArqueo} style={{background:"#2a1f08",border:"1px solid #d4a843",color:"#d4a843",padding:"9px 20px",borderRadius:8,fontSize:13,cursor:"pointer",whiteSpace:"nowrap"}}>📸 Guardar Arqueo</button>
              </div>
            </div>

            {/* Selector de mes */}
            <div style={{...card,marginBottom:20}}>
              <div style={{fontSize:12,color:"#8b7c4a",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Seleccioná un mes para ver el detalle</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {allArqs.map(a=>(
                  <button key={a.id} onClick={()=>setArqSelId(a.id===arqSel?.id?null:a.id)}
                    style={btn(arqSel?.id===a.id,{padding:"5px 12px",fontSize:11})}>
                    {a.mes}
                  </button>
                ))}
              </div>
            </div>

            {/* Detalle del mes seleccionado */}
            {arqSel&&(()=>{
              const CUENTA_COLORS = ["#d4a843","#2196f3","#e74c3c","#7ec87e","#c878e8","#f39c12","#1abc9c"];
              // Collect all accounts that have efectivo data in this arqueo
              const efCuentas = todasCuentas.map((c,i)=>{
                const field = `efectivo_${c.toLowerCase().replace(/\s+/g,"_")}`;
                return {label:c, value:arqSel[field]||0, color:CUENTA_COLORS[i%CUENTA_COLORS.length]};
              }).filter(r=>r.value>0);
              const capCuentas = [
                {label:"Galicia",value:arqSel.capital_galicia||0,color:"#d4a843"},
                {label:"Balanz",value:arqSel.capital_balanz||0,color:"#2196f3"},
                {label:"Balanz CCL",value:arqSel.capital_balanz_ccl||0,color:"#e74c3c"},
              ].filter(r=>r.value>0);
              const totalEf = efCuentas.reduce((s,r)=>s+r.value,0);
              return (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
                  <div style={card}>
                    <div style={{fontSize:13,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>💵 Efectivo — {arqSel.mes}</div>
                    {efCuentas.length===0
                      ? <div style={{color:"#5a4a2a",fontSize:13}}>Sin datos de efectivo</div>
                      : efCuentas.map((r,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #2a2010"}}>
                          <span style={{color:"#c8a96e",fontSize:13}}>{r.label}</span>
                          <span style={{color:r.color,fontWeight:"bold",fontSize:15}}>{f$(r.value)}</span>
                        </div>
                      ))
                    }
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12}}>
                      <span style={{color:"#8b7c4a",fontSize:12,textTransform:"uppercase"}}>Total efectivo</span>
                      <span style={{color:"#7ec87e",fontWeight:"bold",fontSize:16}}>{f$(totalEf)}</span>
                    </div>
                  </div>
                  <div style={card}>
                    <div style={{fontSize:13,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>📈 Capital Invertido — {arqSel.mes}</div>
                    {capCuentas.map((r,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #2a2010"}}>
                        <span style={{color:"#c8a96e",fontSize:13}}>{r.label}</span>
                        <span style={{color:r.color,fontWeight:"bold",fontSize:15}}>{f$(r.value)}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12}}>
                      <span style={{color:"#8b7c4a",fontSize:12,textTransform:"uppercase"}}>Total invertido</span>
                      <span style={{color:"#7ec87e",fontWeight:"bold",fontSize:16}}>{f$(arqSel.capital_invertido??0)}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Gráfico evolución */}
            {(()=>{
              const CUENTA_COLORS = ["#d4a843","#2196f3","#e74c3c","#7ec87e","#c878e8","#f39c12","#1abc9c"];
              // Only show accounts that have at least one non-zero value in allArqs
              const cuentasConDatos = todasCuentas.filter(c=>{
                const field = `efectivo_${c.toLowerCase().replace(/\s+/g,"_")}`;
                return allArqs.some(a=>(a[field]||0)>0);
              });
              return (
                <div style={{...tbl,padding:20,marginBottom:20}}>
                  <div style={{fontSize:12,color:"#8b7c4a",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.07em"}}>Evolución efectivo por cuenta</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={allArqs}>
                      <defs>
                        {cuentasConDatos.map((c,i)=>(
                          <linearGradient key={c} id={`gc${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={CUENTA_COLORS[i%CUENTA_COLORS.length]} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={CUENTA_COLORS[i%CUENTA_COLORS.length]} stopOpacity={0}/>
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2010"/>
                      <XAxis dataKey="mes" tick={{fill:"#5a4a2a",fontSize:9}} interval={2}/>
                      <YAxis tick={{fill:"#5a4a2a",fontSize:9}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                      <Tooltip contentStyle={{background:"#1a1408",border:"1px solid #3a3010",borderRadius:8}} formatter={v=>[f$(v),""]}/>
                      {cuentasConDatos.map((c,i)=>(
                        <Area key={c} type="monotone"
                          dataKey={`efectivo_${c.toLowerCase().replace(/\s+/g,"_")}`}
                          stroke={CUENTA_COLORS[i%CUENTA_COLORS.length]}
                          fill={`url(#gc${i})`}
                          strokeWidth={1.5} name={c}/>
                      ))}
                      <Legend formatter={v=><span style={{color:"#c8a96e",fontSize:11}}>{v}</span>}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}

            {/* Tabla resumen */}
            {(()=>{
              const CUENTA_COLORS = ["#d4a843","#2196f3","#e74c3c","#7ec87e","#c878e8","#f39c12","#1abc9c"];
              const cuentasConDatos = todasCuentas.filter(c=>{
                const field = `efectivo_${c.toLowerCase().replace(/\s+/g,"_")}`;
                return allArqs.some(a=>(a[field]||0)>0);
              });
              const headers = ["Mes","Patrimonio",...cuentasConDatos.map(c=>`Ef. ${c}`),"Total Ef.","Cap. Galicia","Cap. Balanz","Cap. B.CCL","Total Cap.",""];
              return (
                <div style={{...tbl,overflowX:"auto"}}>
                  <table style={{minWidth:900,borderCollapse:"collapse",fontSize:13}}>
                    <thead><tr style={{background:"#1a1408"}}>{headers.map(h=><th key={h} style={TH}>{h}</th>)}</tr></thead>
                    <tbody>
                      {[...allArqs].reverse().map((a,i)=>(
                        <tr key={a.id} onClick={()=>setArqSelId(a.id)} style={{borderBottom:"1px solid #1a1408",background:arqSel?.id===a.id?"#1a1f08":i%2===0?"transparent":"#0f0d04",cursor:"pointer"}}>
                          <td style={TD({color:"#d4a843",fontWeight:"bold"})}>{a.mes}</td>
                          <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(a.patrimonio_total||0)}</td>
                          {cuentasConDatos.map((c,ci)=>{
                            const field = `efectivo_${c.toLowerCase().replace(/\s+/g,"_")}`;
                            return <td key={c} style={TD({color:CUENTA_COLORS[ci%CUENTA_COLORS.length]})}>{f$(a[field]??0)}</td>;
                          })}
                          <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(a.efectivo_total||0)}</td>
                          <td style={TD({color:"#d4a843"})}>{f$(a.capital_galicia??0)}</td>
                          <td style={TD({color:"#2196f3"})}>{f$(a.capital_balanz??0)}</td>
                          <td style={TD({color:"#e74c3c"})}>{f$(a.capital_balanz_ccl??0)}</td>
                          <td style={TD({color:"#7ec87e",fontWeight:"bold"})}>{f$(a.capital_invertido??0)}</td>
                          <td style={TD()}>{arqs.find(r=>r.id===a.id)&&<button onClick={e=>{e.stopPropagation();handleDeleteArq(a.id);}} style={{background:"transparent",border:"1px solid #3a1a1a",color:"#e87c7c",padding:"2px 8px",borderRadius:4,fontSize:11,cursor:"pointer"}}>✕</button>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── CONFIG CUENTAS ── */}
        {tab==="config"&&(
          <div style={{maxWidth:500}}>
            <div style={{fontSize:18,color:"#d4a843",marginBottom:20}}>⚙ Gestión de Cuentas</div>
            <div style={{...card,marginBottom:20}}>
              <div style={{fontSize:13,color:"#8b7c4a",marginBottom:16}}>Cuentas activas</div>
              {cuentas.map(c=>(
                <div key={c} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#120f05",border:"1px solid #2a2010",borderRadius:8,marginBottom:8}}>
                  <span style={{color:"#f0e6c8",fontSize:13}}>{c}</span>
                  {!CUENTAS_DEFAULT.includes(c)
                    ?<button onClick={()=>handleDeleteCuenta(c)} style={{background:"transparent",border:"1px solid #3a1a1a",color:"#e87c7c",padding:"3px 10px",borderRadius:6,fontSize:11,cursor:"pointer"}}>Eliminar</button>
                    :<span style={{fontSize:11,color:"#5a4a2a"}}>default</span>}
                </div>
              ))}
            </div>
            <div style={card}>
              <div style={{fontSize:13,color:"#8b7c4a",marginBottom:14}}>Agregar nueva cuenta</div>
              <div style={{display:"flex",gap:10}}>
                <input value={nuevaCuenta} onChange={e=>setNuevaCuenta(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAddCuenta()} placeholder="ej: Interactive Brokers..." style={{...inp,flex:1}}/>
                <button onClick={handleAddCuenta} style={{background:"#d4a843",color:"#0d0b06",padding:"8px 20px",borderRadius:8,fontSize:13,fontWeight:"bold",cursor:"pointer",border:"none",whiteSpace:"nowrap"}}>+ Agregar</button>
              </div>
              <div style={{fontSize:11,color:"#5a4a2a",marginTop:10}}>Las cuentas nuevas se guardan en Supabase.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
