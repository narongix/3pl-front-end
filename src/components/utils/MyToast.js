class MyToast{
    showFailedToast({summary, msg}){
        return {
            severity: "error",
            summary: summary || "Error",
            detail: msg || "Failed",
            life: 1000
        };
    }
}

export default new MyToast();
