class MyNumber{
    convertToTwoDecimal(num){
        const splitNum = num?.toString()?.split(".");
        let myNum = splitNum?.[0];
        let decimal = splitNum?.[1];

        // if the value is num, and the number is a decimal, and the decimal is bigger than>2
        if(Number(num) && Number(num) % 1 != 0 && decimal.length>2){
            // Accept all number after the 2nd position 
            // Ex: 12345678, 12 will be ingore 3 and beyond will be accepted
            // if after 2 comes 0 will not accept anything beyond it [^0]
            // (?<=^.{2})[^0][0-9]+
            // If there are number other than 0 beyond the first 2 digits
            if(/(?<=^.{2})[^0][0-9]+/.test(decimal)){
                // replace everything beyond the first 2 decimal digit
                const replace = decimal?.replace(/(?<=^.{2})[^0][0-9]+/, "");
                // plus 1 to the 2nd digit and convert back to decimal

                // Convert to Number and +1 to round up
                const convertToNum = Number(replace)+1;
                // Convert back to decimal, sometime js would calculate wrongly with a +-1 precision, which leads to
                // 00.num00000000001
                // Tofixed is there to erase those num, also convert back to number with +
                const convertBackToDigit = +(convertToNum * 0.01).toFixed(2);
                // Sum the original number back together
                const newNum = Number(myNum) + convertBackToDigit;
                return newNum;
            }
            else{
                const replace = decimal.replace(/(?<=^.{2})[0-9]+/, "")
                const newNum = Number(myNum) + (Number(replace))*0.01
                return newNum;
            }
        }
        else{
            return (Number(num) || 0).toFixed(2) ?? 0;
        }
    }
}

module.exports= new MyNumber();