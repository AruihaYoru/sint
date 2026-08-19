import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc,
    query, 
    orderBy,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let db = null;

// Firebase初期化関数
export async function initFirebase() {
    if (db) return db;
    try {
        // api/key.json を読み込む
        const response = await fetch('../api/key.json');
        if (!response.ok) {
            throw new Error(`Failed to load Firebase config: ${response.status}`);
        }
        const firebaseConfig = await response.json();
        
        // プレースホルダーの場合は警告
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn("Firebase configuration is using placeholders. Please update api/key.json.");
            // ダミーのオブジェクトを返してエラーを回避する (UIプレビュー用)
            return null;
        }

        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        return db;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return null;
    }
}

// 記事を保存
export async function saveArticle(title, content) {
    if (!db) throw new Error("Database not initialized");
    const articlesCol = collection(db, "articles");
    const docRef = await addDoc(articlesCol, {
        title: title,
        content: content,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

// 記事一覧を取得
export async function loadArticles() {
    if (!db) {
        console.warn("Database not initialized. Returning empty array.");
        return [];
    }
    const articlesCol = collection(db, "articles");
    const q = query(articlesCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const articles = [];
    snapshot.forEach(doc => {
        articles.push({ id: doc.id, ...doc.data() });
    });
    return articles;
}

// 個別の記事を取得
export async function getArticle(articleId) {
    if (!db) return null;
    const docRef = doc(db, "articles", articleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}

// コメントを保存
export async function saveComment(articleId, author, text) {
    if (!db) throw new Error("Database not initialized");
    // articles/{articleId}/comments コレクションに保存
    const commentsCol = collection(db, "articles", articleId, "comments");
    const docRef = await addDoc(commentsCol, {
        author: author,
        text: text,
        createdAt: serverTimestamp()
    });
    return docRef.id;
}

// コメント一覧を取得
export async function loadComments(articleId) {
    if (!db) return [];
    const commentsCol = collection(db, "articles", articleId, "comments");
    const q = query(commentsCol, orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    const comments = [];
    snapshot.forEach(doc => {
        comments.push({ id: doc.id, ...doc.data() });
    });
    return comments;
}
