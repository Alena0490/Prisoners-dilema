import Papa from 'papaparse';
import countries from 'i18n-iso-countries';

interface CSVRow {
  'Country Name': string;
  'Country Code': string;
  'Indicator Name': string;
  'Indicator Code': string;
  1960: string;
  1961: string;
  1962: string;
  1963: string;
  1964: string;
  1965: string;
  1966: string;
  1967: string;
  1968: string;
  1969: string;
  1970: string;
  1971: string;
  1972: string;
  1973: string;
  1974: string;
  1975: string;
  1976: string;
  1977: string;
  1978: string;
  1979: string;
  1980: string;
  1981: string;
  1982: string;
  1983: string;
  1984: string;
  1985: string;
  1986: string;
  1987: string;
  1988: string;
  1989: string;
  1990: string;
  1991: string;
  1992: string;
  1993: string;
  1994: string;
  1995: string;
  1996: string;
  1997: string;
  1998: string;
  1999: string;
  2000: string;
  2001: string;
  2002: string;
  2003: string;
  2004: string;
  2005: string;
  2006: string;
  2007: string;
  2008: string;
  2009: string;
  2010: string;
  2011: string;
  2012: string;
  2013: string;
  2014: string;
  2015: string;
  2016: string;
  2017: string;
  2018: string;
  2019: string;
  2020: string;
  2021: string;
  2022: string;
  2023: string;
  2024: string;
}

export const parseGDPFromCSV = (file: File): Promise<Record<string, number>> => {
  return new Promise((resolve, reject) => {
    Papa.parse<CSVRow>(file, {
        header: true,
  skipEmptyLines: true,
  preview: 0,
  beforeFirstChunk: (chunk) => {
    // Cut off the first 4 lines of metadata
    const lines = chunk.split('\n');
    return lines.slice(4).join('\n');
  },
      complete: (results) => {
        const gdpData: Record<string, number> = {};

        results.data.forEach((row) => {
          const code3 = row['Country Code'];
          const value = row['2023'];
          
          if (code3 && value && !isNaN(Number(value))) {
            // Transfer ISO3 to ISO2
            const code2 = countries.alpha3ToAlpha2(code3);
            
            if (code2) {
              gdpData[code2] = Number(value);
            }
          }
        }); 

        console.log('🔍 DEBUG - GDP entries found:', Object.keys(gdpData).length);
        resolve(gdpData);
      },
      error: reject
    });
  });
};