class MyNumber{
    convertToTwoDecimal(num){
        return MyNumber.convertDecimal(num, 2);
    }

    convertToFourDecimal(num){
        return MyNumber.convertDecimal(num, 4);
    }


    static convertDecimal(num, digit){
        const splitNum = num?.toString()?.split(".");
        let myNum = Number(splitNum?.[0]);
        let decimal = splitNum?.[1];    
        // Whether the decimal digit is higher than the targeted digit
        if(decimal?.length>digit){
            let originalDecimal = decimal.substring(0, digit);
            let lastDecimal = decimal.substring(digit, decimal.length);

            if(lastDecimal[0]>0){
                // To protect against leading 0, 006, 07, etc.
                // Converting it to Number will erase the leading 0 
                // so we need to restore it back once we have finish calculating
                let myZero = originalDecimal.length;
                originalDecimal = Number(originalDecimal)+1;
                while(originalDecimal.toString().length<myZero){
                    originalDecimal = "0"+originalDecimal;
                }
            }
                        
            // In case that we have numbers like, 6999 or sth and it comes .7
            // we add to its suffix 
            while(originalDecimal.length < digit){
                originalDecimal = [originalDecimal, "0"].join("");
            }

            const lastConvert = myNum+"."+originalDecimal;
            return lastConvert;
        }
        else{
            return Number(num ?? 0).toFixed(digit);
        }
    }


    // TODO: there are still erros to this, I don't know why
    // 25781 will not round the number up. The Regex recognizes it,
    // Either find a way to fix this or use the normal split strubg and count array which is
    // Arguably easier.
    // convertRegex(num, digit){
    //     const splitNum = num?.toString()?.split(".");
    //     let myNum = splitNum?.[0];
    //     let decimal = splitNum?.[1];

    //     // if the value is num, and the number is a decimal, and the decimal is bigger than>2
    //     if(Number(num) && Number(num) % 1 != 0 && decimal.length>digit){
    //         // Accept all number after the 2nd position 
    //         // Ex: 12345678, 12 will be ingore 3 and beyond will be accepted
    //         // if after 2 comes 0 will not accept anything beyond it [^0]
    //         // (?<=^.{2})[^0][0-9]+
    //         // If there are number other than 0 beyond the first 2 digits

    //         // UPDATE: digit is the first 2 digit now it's flexible
    //         const regex = new RegExp(`(?<=^.{${digit}})[^0][0-9]+`);
    //         const regexAcceptZero = new RegExp(`(?<=^.{${digit}})[0-9]+`);
    //         let myDecimal = 1;
    //         for(let i = 0; i<digit; i++){
    //             myDecimal = +(myDecimal).toFixed(i+1) * 0.1;
    //         }
    //         myDecimal = +(myDecimal).toFixed(digit)
    //         if(regex.test(decimal)){
    //             // replace everything beyond the first 2 decimal digit
    //             const replace = decimal?.replace(regex, "");
    //             // plus 1 to the 2nd digit and convert back to decimal

    //             // Convert to Number and +1 to round up
    //             const convertToNum = Number(replace)+1;
                

    //             // Convert back to decimal, sometime js would calculate wrongly with a +-1 precision, which leads to
    //             // 00.num00000000001
    //             // Tofixed is there to erase those num, also convert back to number with +
    //             const convertBackToDigit = +(convertToNum * myDecimal).toFixed(digit);
              
    //             // Sum the original number back together
    //             const newNum = Number(myNum) + convertBackToDigit;
    //             return newNum;
    //         }
    //         else{
    //             const replace = decimal.replace(regexAcceptZero, "");
    //             const newNum = Number(myNum) + (Number(replace)) * myDecimal;
    //             return newNum.toFixed(digit);
    //         }
    //     }
    //     else{
    //         return (Number(num) || 0).toFixed(digit) ?? 0;
    //     }
    // }
}

module.exports= new MyNumber();