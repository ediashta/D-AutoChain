export const FormatDate=(value)=>{
    const date = new Date(value);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };
    return  date.toLocaleDateString('en-US', options).replace(/\//g, '-');
}