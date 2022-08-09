#include <emscripten.h>
#include <array>

typedef long int i32;

extern "C"{

EMSCRIPTEN_KEEPALIVE
const i32* factorial(i32 *size, i32 n) {
    int i,fact=1;
    *size = 1;

    i32 res [*size];
    const i32* result = res;

    for(i=1;i<=n;i++){    
        fact=fact*i;
    }
    res[0] = fact;
    return result;
}

EMSCRIPTEN_KEEPALIVE
const i32* bigfacts(i32 n)
{
    i32 res[500];
    for (int i=0; i<500; i++)
    {
        res[i] = 0;    
    }

    res[0] = 1;

    int res_size = 1;
    const i32* result = &res[0];

    for (int x=2; x<=n; x++)
    {
        int carry = 0;

        for (int i=0; i<res_size; i++)
        {
            int prod = res[i] * x + carry;
            res[i] = prod % 10;  
            carry  = prod/10;    
        }

        while (carry)
        {
            res[res_size] = carry%10;
            carry = carry/10;
            res_size++;
        }
    }

    return result;
}

}