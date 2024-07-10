    // import axios from 'axios';

    // const API_KEY = 'AIzaSyC9FT-_OvJsILO_YJ82UuGV-vchfutEqNo';
    // const API_URL = 'https://translation.googleapis.com/language/translate/v2';

    // // Cache object to store translations
    // const translationCache = {};

    // export const translateText = async (text, targetLanguage) => {
    // const cacheKey = `${text}_${targetLanguage}`;
    
    // // Check if translation exists in cache
    // if (translationCache[cacheKey]) {
    //     return translationCache[cacheKey];
    // }

    // try {
    //     const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
    //     q: text,
    //     target: targetLanguage,
    //     });

    //     const translatedText = response.data.data.translations[0].translatedText;
        
    //     // Store translation in cache
    //     translationCache[cacheKey] = translatedText;

    //     return translatedText;
    // } catch (error) {
    //     if (error.response) {
    //     // The request was made and the server responded with a status code
    //     console.error('Response status:', error.response.status);
    //     console.error('Response data:', error.response.data);
    //     } else if (error.request) {
    //     // The request was made but no response was received
    //     console.error('Request error:', error.request);
    //     } else {
    //     // Something happened in setting up the request that triggered an error
    //     console.error('Error:', error.message);
    //     }

    //     // Return original text or handle error as per your application logic
    //     return text;
    // }
    // };










    import axios from 'axios';

    const API_KEY = 'AIzaSyC9FT-_OvJsILO_YJ82UuGV-vchfutEqNo'; // Replace with your Google Translate API key
    const API_URL = 'https://translation.googleapis.com/language/translate/v2';

    // Function to get translation from local storage
    const getTranslationFromLocalStorage = (cacheKey) => {
    const storedTranslations = JSON.parse(localStorage.getItem('translationCache')) || {};
    return storedTranslations[cacheKey];
    };

    // Function to save translation to local storage
    const saveTranslationToLocalStorage = (cacheKey, translatedText) => {
    const storedTranslations = JSON.parse(localStorage.getItem('translationCache')) || {};
    storedTranslations[cacheKey] = translatedText;
    localStorage.setItem('translationCache', JSON.stringify(storedTranslations));
    };

    export const translateText = async (text, targetLanguage) => {
    const cacheKey = `${text}_${targetLanguage}`;
    
    // Check if translation exists in local storage
    const cachedTranslation = getTranslationFromLocalStorage(cacheKey);
    if (cachedTranslation) {
        return cachedTranslation;
    }

    try {
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
        q: text,
        target: targetLanguage,
        });

        const translatedText = response.data.data.translations[0].translatedText;
        
        // Store translation in local storage
        saveTranslationToLocalStorage(cacheKey, translatedText);

        return translatedText;
    } catch (error) {
        if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        } else if (error.request) {
        console.error('Request error:', error.request);
        } else {
        console.error('Error:', error.message);
        }

        // Return original text or handle error as per my application logic
        return text;
    }
    };
