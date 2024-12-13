import sql from "better-sqlite3";

const db = new sql("posts.db");

function initDb(){
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            email TEXT
            )`);

    db.exec(`
        CREATE TABLE IF NOT EXISTS posts(
            id INTEGER PRIMARY KEY,
            image_url TEXT NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )`);

    db.exec(`
        CREATE TABLE IF NOT EXISTS likes(
            user_id INTEGER,
            post_id INTEGER,
            PRIMARY KEY(user_id, post_id),
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
        )`)
    
    // Creating two dummy users if they don't exist already 
    const stmt = db.prepare('SELECT COUNT(*) AS count FROM users');
    
    if(stmt.get().count === 0){
        db.exec(`
            INSERT INTO users(id, first_name, last_name, email)
            VALUES (1, 'John', 'Doe', 'john@example.com')
        `);
        db.exec(`
            INSERT INTO users(id, first_name, last_name, email)
            VALUES (2, 'Max', 'Schwarz', 'max@example.com')
        `);
    }
}

initDb();

export async function getPosts(maxNumber) { //maxNumber: isteğe bağlı
    let limitClause = '';
    if(maxNumber){ //maxnumber sağlanırsa SQL sorgusuna LIMIT eklenir
        limitClause = "LIMIT ?"; // SQL sorgusunda belirtilen sayıda sonuç döndürür. 
    }
    // const stmt = db.prepare(`
    //     SELECT 
    //         posts.id, Gönderinin benzersiz kimliği.
    //         image_url AS image,  Görsel URL’si, "image" olarak adlandırılır.
    //         title, Gönderi başlığı.
    //         content,  Gönderi içeriği.
    //         created_at AS createdAt, Gönderinin oluşturulma tarihi, "createdAt" olarak adlandırılır.
    //         first_name AS userFirstName,
    //         last_name AS userLastName,
    //         COUNT(likes.post_id) AS likes, Gönderiye yapılan beğeni sayısı
    //         EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked //Kullanıcı gönderiyi beğenmiş mi? Beğenmişse isLiked sütunu 1 , aksi halde 0.
    //     FROM posts // Gönderi verilerinin çekileceği tablo.
    //     INNER JOIN users ON posts.user_id = users.id // Gönderinin paylaşıldığı kullanıcı bilgilerini almak için posts.user_id ve users.id birleştirilir.
    //     LEFT JOIN likes ON posts.id = likes.post_id // Gönderiye ait beğenileri almak için posts.id ve likes.post_id birleştirilir.
    //     GROUP BY posts.id // Beğeni sayısını hesaplamak için gönderiler gruplandırılır.
    //     ORBER BY createdAt DESC  // Gönderiler oluşturulma tarihine göre azalan sırayla (en son gönderilen ilk) sıralanır.
    //     ${limitClause} //  ifadesi burada eklenir ve döndürülecek sonuç sayısını sınırlar.
    //     `)

    const stmt = db.prepare(`
        SELECT 
            posts.id, 
            image_url AS image, 
            title, 
            content, 
            created_at AS createdAt,
            first_name AS userFirstName,
            last_name AS userLastName,
            COUNT(likes.post_id) AS likes,
            EXISTS(SELECT * FROM likes WHERE likes.post_id = posts.id and likes.user_id = 2) AS isLiked
        FROM posts
        INNER JOIN users ON posts.user_id = users.id
        LEFT JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id
        ORDER BY createdAt DESC  
        ${limitClause}
        `)

    // for asynchron simulation: setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // gönderi listesini döndür:
    return maxNumber ? stmt.all(maxNumber) : stmt.all();
}

// burada alınan post'un içeriği: post.imageUrl, post.title, post.content, post.userId
// veritabanına yeni kayıt ekle
export async function storePost(post) {
    const stmt = db.prepare(`
        INSERT INTO posts (image_url, title, content, user_id)
        VALUES (?, ?, ?, ?)`);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return stmt.run(post.imageUrl, post.title, post.content, post.userId);
}


// postId = beğenilecek gönderi kimliği
// userId = beğenecek kişi kimliği
export async function updatePostLikeStatus(postId, userId) {

    console.log("POSTID SERVER : ", postId);
    console.log("USERID SERVER : ",userId);

  // Validate userId
  const userExists = db.prepare(`SELECT COUNT(*) AS count FROM users WHERE id = ?`).get(userId).count > 0;
  if (!userExists) {
      throw new Error(`User with ID ${userId} does not exist!!!!!`);
  }

  // Validate postId
  const postExists = db.prepare(`SELECT COUNT(*) AS count FROM posts WHERE id = ?`).get(postId).count > 0;
  if (!postExists) {
      throw new Error(`Post with ID ${postId} does not exist!!!!!`);
  }



    // bu user_id'li kişi, bu post_id'li postu beğenmişse count=1, beğenmemişse count=0
    const stmtCheck = db.prepare(`
        SELECT EXISTS(
            SELECT 1
            FROM likes
            WHERE user_id = ? AND post_id = ?
        ) AS isLiked
    `);
    //güvenlik için ?, ? (sql injection a karşı)

    const isLiked = stmtCheck.get(userId, postId).isLiked === 1;
    
    console.log("isLiked SERVER : ", isLiked)



    if(!isLiked){ 
        const stmtInsert = db.prepare(`
            INSERT INTO likes (user_id, post_id)
            VALUES (?, ?)
        `);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        stmtInsert.run(userId, postId); 

        return { status: "liked", postId, userId };
        
    }else{ 
        const stmtDelete = db.prepare(`
            DELETE FROM likes
            WHERE user_id = ? AND post_id = ?
        `);
        await new Promise((resolve) => setTimeout(resolve, 1000));    
        stmtDelete.run(userId, postId);

        return { status: "unliked", postId, userId };
    }
}


