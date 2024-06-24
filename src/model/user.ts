/**
 * Express API - User model.
 *
 * 1.0.1 # Aleksandr Vorkunov <devbyzero@yandex.ru>
 */

class UserModel {
    static createUser(
        name: string,
        email: string,
        password: string,
        salt: string,
        sid: string
    ): string {
        return `
            INSERT INTO mysql_user(
                name,
                email,
                password,
                salt,
                sid,
                sid_expire
            ) 
            VALUES(
                "${name}",
                "${email}",
                "${password}",
                "${salt}",
                "${sid}",
                NOW() + INTERVAL 1 MONTH
            )
        `;
    }

    static getUserBySessionID(sid:string):string {
        return `SELECT * FROM mysql_user WHERE sid = "${sid}"`;
    }

    static getUserByEmail(email:string):string {
        return `SELECT * FROM mysql_user WHERE email = "${email}"`;
    }

    static updateUserSessionID(user_id:number, sid:string):string {
        return `
            UPDATE mysql_user 
            SET 
                sid = "${sid}", 
                sid_expire = (NOW() + INTERVAL 1 MONTH) 
            WHERE id = ${user_id}
        `;
    }
}

export default UserModel;