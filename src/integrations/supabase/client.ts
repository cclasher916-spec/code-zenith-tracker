// Stub file - Supabase has been replaced with Firebase
// This file exists only for backward compatibility with unmigrated components
// All new code should use Firebase dbService instead

export const supabase = {
    from: () => ({
        select: () => ({
            order: () => ({ data: [], error: null }),
            eq: () => ({ data: [], error: null }),
        }),
        insert: () => ({ error: new Error('Supabase not configured') }),
        update: () => ({ error: new Error('Supabase not configured') }),
        delete: () => ({ error: new Error('Supabase not configured') }),
    }),
    auth: {
        resetPasswordForEmail: () => ({ error: new Error('Use Firebase auth instead') }),
    },
};
