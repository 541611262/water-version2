// 用户数据存储
let users = [];
let currentUser = null;
let customers = [];

// DOM元素
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const recoverySection = document.getElementById('recoverySection');
const adminUserManagement = document.getElementById('adminUserManagement');
const mainApp = document.getElementById('mainApp');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');
const showRegisterLink = document.getElementById('showRegisterLink');
const showLoginLink = document.getElementById('showLoginLink');
const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');
const confirmPassword = document.getElementById('confirmPassword');
const registerBtn = document.getElementById('registerBtn');
// 新增安全问题相关元素
const securityQuestion = document.getElementById('securityQuestion');
const securityAnswer = document.getElementById('securityAnswer');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
const recoveryError = document.getElementById('recoveryError');
const currentUsername = document.getElementById('currentUsername');
const currentUserRole = document.getElementById('currentUserRole');
const logoutBtn = document.getElementById('logoutBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const changePasswordModal = document.getElementById('changePasswordModal');
const changePasswordError = document.getElementById('changePasswordError');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmNewPassword = document.getElementById('confirmNewPassword');
const savePasswordBtn = document.getElementById('savePasswordBtn');
const closeBtn = document.querySelector('.close');

// 密码恢复相关元素
const showRecoveryLink = document.getElementById('showRecoveryLink');
const backToLoginLink = document.getElementById('backToLoginLink');
const recoveryUsername = document.getElementById('recoveryUsername');
const recoverySecurityAnswer = document.getElementById('recoverySecurityAnswer');
const newRecoveryPassword = document.getElementById('newRecoveryPassword');
const confirmRecoveryPassword = document.getElementById('confirmRecoveryPassword');
const recoveryBtn = document.getElementById('recoveryBtn');

// 管理员用户管理相关元素
const userList = document.getElementById('userList');
const backToMainAppLink = document.getElementById('backToMainAppLink');

// 客户管理相关元素
const customerNameInput = document.getElementById('customerName');
const contactPersonInput = document.getElementById('contactPerson');
const phoneNumberInput = document.getElementById('phoneNumber');
const filterPurchaseDateInput = document.getElementById('filterPurchaseDate');
const customIntervalInput = document.getElementById('customInterval');
const addCustomerBtn = document.getElementById('addCustomer');
const reminderList = document.getElementById('reminderList');
const showAllCheckbox = document.getElementById('showAll');
const importBtn = document.getElementById('importBtn');
const exportBtn = document.getElementById('exportBtn');
const downloadSample = document.getElementById('downloadSample');
const csvFile = document.getElementById('csvFile');
const importStatus = document.getElementById('importStatus');

// 搜索相关元素
const customerSearch = document.getElementById('customerSearch');

// 初始化：设置默认日期为今天
document.addEventListener('DOMContentLoaded', () => {
    // 确保DOM元素存在
    if (filterPurchaseDateInput) {
        const today = new Date().toISOString().split('T')[0];
        filterPurchaseDateInput.value = today;
    }
    
    // 从localStorage加载用户和客户数据
    loadUsersFromStorage();
    loadCustomersFromStorage();
    
    // 检查是否有已登录用户
    checkLoggedInUser();
    
    // 绑定事件监听器
    setTimeout(bindEventListeners, 100); // 延迟绑定以确保所有元素都已加载
});

// 绑定所有事件监听器
function bindEventListeners() {
    // 确保DOM元素存在后再绑定事件
    if (!loginBtn || !showRegisterLink || !showLoginLink || !registerBtn) {
        console.error('部分DOM元素未找到，无法绑定事件监听器');
        return;
    }
    
    // 登录相关
    loginBtn.addEventListener('click', login);
    showRegisterLink.addEventListener('click', showRegistration);
    showLoginLink.addEventListener('click', showLogin);
    registerBtn.addEventListener('click', register);
    
    // 确保元素存在后再绑定事件
    if (showRecoveryLink) showRecoveryLink.addEventListener('click', showRecovery);
    if (backToLoginLink) backToLoginLink.addEventListener('click', showLogin);
    if (recoveryBtn) recoveryBtn.addEventListener('click', recoverPassword);
    if (backToMainAppLink) backToMainAppLink.addEventListener('click', showMainApp);
    
    // 主应用相关
    if (addCustomerBtn) addCustomerBtn.addEventListener('click', addCustomer);
    if (importBtn) importBtn.addEventListener('click', importData);
    if (exportBtn) exportBtn.addEventListener('click', exportCSV);
    if (downloadSample) downloadSample.addEventListener('click', downloadSampleCSV);
    if (showAllCheckbox) showAllCheckbox.addEventListener('change', renderReminderList);
    if (customerSearch) customerSearch.addEventListener('input', renderReminderList);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', showChangePasswordModal);
    
    // 修改密码模态框相关
    if (savePasswordBtn) savePasswordBtn.addEventListener('click', changePassword);
    if (closeBtn) closeBtn.addEventListener('click', closeChangePasswordModal);
    
    window.addEventListener('click', (e) => {
        if (changePasswordModal && e.target === changePasswordModal) {
            closeChangePasswordModal();
        }
    });
    
    // 管理员功能相关
    if (currentUser && currentUser.role === 'admin') {
        showAdminUserManagement();
    }
}

// 从localStorage加载用户数据
function loadUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('waterFilterUsers');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
        } else {
            // 如果没有用户，创建默认管理员账户
            createDefaultAdmin();
        }
    } catch (error) {
        console.error('Error loading users from storage:', error);
        users = [];
        createDefaultAdmin();
    }
}

// 创建默认管理员账户
function createDefaultAdmin() {
    const adminUser = {
        id: 1,
        username: 'admin',
        password: 'admin123', // 在实际应用中，这应该是哈希后的密码
        securityQuestion: '默认管理员账户',
        securityAnswer: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    saveUsersToStorage();
    console.log('默认管理员账户已创建 (用户名: admin, 密码: admin123)');
}

// 保存用户数据到localStorage
function saveUsersToStorage() {
    try {
        localStorage.setItem('waterFilterUsers', JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users to storage:', error);
    }
}

// 从localStorage加载客户数据
function loadCustomersFromStorage() {
    try {
        const storedCustomers = localStorage.getItem('waterFilterCustomers');
        if (storedCustomers) {
            customers = JSON.parse(storedCustomers);
        }
    } catch (error) {
        console.error('Error loading customers from storage:', error);
        customers = [];
    }
}

// 保存客户数据到localStorage
function saveCustomersToStorage() {
    try {
        localStorage.setItem('waterFilterCustomers', JSON.stringify(customers));
    } catch (error) {
        console.error('Error saving customers to storage:', error);
    }
}

// 检查是否有已登录用户
function checkLoggedInUser() {
    try {
        const loggedInUser = localStorage.getItem('waterFilterCurrentUser');
        if (loggedInUser) {
            currentUser = JSON.parse(loggedInUser);
            showMainApp();
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Error checking logged in user:', error);
        showLogin();
    }
}

// 显示登录界面
function showLogin() {
    loginSection.style.display = 'block';
    registerSection.style.display = 'none';
    recoverySection.style.display = 'none';
    mainApp.style.display = 'none';
    loginError.textContent = '';
    loginUsername.value = '';
    loginPassword.value = '';
    // 清空安全问题和答案字段
    if (securityQuestion) securityQuestion.value = '';
    if (securityAnswer) securityAnswer.value = '';
    // 清空密码恢复字段
    if (recoveryUsername) recoveryUsername.value = '';
    if (recoverySecurityAnswer) recoverySecurityAnswer.value = '';
    if (newRecoveryPassword) newRecoveryPassword.value = '';
    if (confirmRecoveryPassword) confirmRecoveryPassword.value = '';
    if (recoveryError) recoveryError.textContent = '';
}

// 显示注册界面
function showRegistration(e) {
    e.preventDefault();
    loginSection.style.display = 'none';
    registerSection.style.display = 'block';
    registerError.textContent = '';
    registerUsername.value = '';
    registerPassword.value = '';
    confirmPassword.value = '';
    // 清空安全问题和答案字段
    if (securityQuestion) securityQuestion.value = '';
    if (securityAnswer) securityAnswer.value = '';
}

// 显示密码恢复界面
function showRecovery(e) {
    if (e) e.preventDefault();
    loginSection.style.display = 'none';
    recoverySection.style.display = 'block';
    recoveryError.textContent = '';
    recoveryUsername.value = '';
    recoverySecurityAnswer.value = '';
    newRecoveryPassword.value = '';
    confirmRecoveryPassword.value = '';
}

// 密码恢复功能
function recoverPassword(e) {
    e.preventDefault();
    const username = recoveryUsername.value.trim();
    const securityAnswer = recoverySecurityAnswer.value.trim();
    const newPassword = newRecoveryPassword.value;
    const confirmNewPassword = confirmRecoveryPassword.value;
    
    // 验证输入
    if (!username || !securityAnswer || !newPassword || !confirmNewPassword) {
        recoveryError.textContent = '请填写所有字段';
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        recoveryError.textContent = '新密码和确认密码不一致';
        return;
    }
    
    if (newPassword.length < 6) {
        recoveryError.textContent = '新密码长度至少为6位';
        return;
    }
    
    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
        recoveryError.textContent = '用户不存在';
        return;
    }
    
    // 验证安全问题答案
    if (user.securityAnswer !== securityAnswer) {
        recoveryError.textContent = '安全问题答案错误';
        return;
    }
    
    // 更新密码
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        saveUsersToStorage();
        alert('密码恢复成功，请使用新密码登录');
        showLogin();
    } else {
        recoveryError.textContent = '用户不存在';
    }
}

// 显示主应用
function showMainApp() {
    loginSection.style.display = 'none';
    registerSection.style.display = 'none';
    recoverySection.style.display = 'none';
    adminUserManagement.style.display = 'none';
    mainApp.style.display = 'block';
    currentUsername.textContent = currentUser.username;
    currentUserRole.textContent = currentUser.role === 'admin' ? '管理员' : '普通用户';
    renderReminderList();
    
    // 如果是管理员，添加用户管理按钮
    if (currentUser.role === 'admin') {
        const userManagementBtn = document.createElement('button');
        userManagementBtn.textContent = '用户管理';
        userManagementBtn.id = 'userManagementBtn';
        userManagementBtn.style.marginLeft = '10px';
        userManagementBtn.addEventListener('click', showAdminUserManagement);
        
        // 检查按钮是否已存在，避免重复添加
        if (!document.getElementById('userManagementBtn')) {
            document.querySelector('.user-info').appendChild(userManagementBtn);
        }
    }
}

// 显示管理员用户管理界面
function showAdminUserManagement(e) {
    if (e) e.preventDefault();
    mainApp.style.display = 'none';
    adminUserManagement.style.display = 'block';
    renderUserList();
}

// 渲染用户列表
function renderUserList() {
    userList.innerHTML = '';
    
    if (!currentUser || currentUser.role !== 'admin') {
        userList.innerHTML = '<p>您没有权限访问此页面</p>';
        return;
    }
    
    if (users.length === 0) {
        userList.innerHTML = '<p>暂无用户记录</p>';
        return;
    }
    
    users.forEach(user => {
        // 不显示默认管理员账户的管理选项
        const isDefaultAdmin = user.username === 'admin' && user.id === 1;
        
        const item = document.createElement('div');
        item.className = 'user-item';
        item.innerHTML = `
            <div class="user-item-info">
                <h3>${user.username}</h3>
                <p>角色: ${user.role === 'admin' ? '管理员' : '普通用户'}</p>
                <p>创建时间: ${new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="user-item-actions">
                ${!isDefaultAdmin ? `
                    ${user.role === 'admin' ? 
                        `<button class="demote-user-btn" data-id="${user.id}">降级为普通用户</button>` : 
                        `<button class="promote-user-btn" data-id="${user.id}">提升为管理员</button>`}
                    <button class="delete-user-btn" data-id="${user.id}">删除用户</button>
                ` : '<span>默认管理员账户</span>'}
            </div>
        `;
        userList.appendChild(item);
    });
    
    // 添加事件监听器
    document.querySelectorAll('.promote-user-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            promoteUser(userId);
        });
    });
    
    document.querySelectorAll('.demote-user-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            demoteUser(userId);
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

// 提升用户为管理员
function promoteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = 'admin';
        saveUsersToStorage();
        renderUserList();
        // 如果正在管理的是当前用户，更新界面
        if (currentUser.id === userId) {
            currentUser.role = 'admin';
            localStorage.setItem('waterFilterCurrentUser', JSON.stringify(currentUser));
            showMainApp();
        }
    }
}

// 降级管理员为普通用户
function demoteUser(userId) {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].role = 'user';
        saveUsersToStorage();
        renderUserList();
        // 如果正在管理的是当前用户，更新界面
        if (currentUser.id === userId) {
            currentUser.role = 'user';
            localStorage.setItem('waterFilterCurrentUser', JSON.stringify(currentUser));
            showMainApp();
        }
    }
}

// 删除用户
function deleteUser(userId) {
    if (userId === 1 && users.find(u => u.id === 1).username === 'admin') {
        alert('不能删除默认管理员账户');
        return;
    }
    
    if (confirm('确定要删除这个用户吗？这将同时删除该用户的所有客户数据。')) {
        // 删除用户
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
        }
        
        // 删除该用户的所有客户数据
        customers = customers.filter(customer => customer.userId !== userId);
        saveCustomersToStorage();
        saveUsersToStorage();
        renderUserList();
        
        // 如果删除的是当前用户，退出登录
        if (currentUser.id === userId) {
            logout();
        }
    }
}

// 登录功能
function login(e) {
    e.preventDefault();
    const username = loginUsername.value.trim();
    const password = loginPassword.value;
    
    if (!username || !password) {
        loginError.textContent = '请输入用户名和密码';
        return;
    }
    
    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('waterFilterCurrentUser', JSON.stringify(currentUser));
        showMainApp();
    } else {
        loginError.textContent = '用户名或密码错误';
    }
}

// 注册功能
function register(e) {
    e.preventDefault();
    const username = registerUsername.value.trim();
    const password = registerPassword.value;
    const confirmPwd = confirmPassword.value;
    const secQuestion = securityQuestion.value.trim();
    const secAnswer = securityAnswer.value.trim();
    
    // 验证输入
    if (!username || !password || !secQuestion || !secAnswer) {
        registerError.textContent = '请填写所有字段';
        return;
    }
    
    if (password !== confirmPwd) {
        registerError.textContent = '两次输入的密码不一致';
        return;
    }
    
    if (password.length < 6) {
        registerError.textContent = '密码长度至少为6位';
        return;
    }
    
    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
        registerError.textContent = '用户名已存在';
        return;
    }
    
    // 创建新用户（普通用户）
    const newUser = {
        id: Date.now(),
        username,
        password, // 在实际应用中，这应该是哈希后的密码
        securityQuestion: secQuestion,
        securityAnswer: secAnswer,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsersToStorage();
    
    // 自动登录
    currentUser = newUser;
    localStorage.setItem('waterFilterCurrentUser', JSON.stringify(currentUser));
    showMainApp();
}

// 退出登录
function logout() {
    currentUser = null;
    localStorage.removeItem('waterFilterCurrentUser');
    showLogin();
}

// 显示修改密码模态框
function showChangePasswordModal() {
    changePasswordModal.style.display = 'block';
    changePasswordError.textContent = '';
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';
}

// 关闭修改密码模态框
function closeChangePasswordModal() {
    changePasswordModal.style.display = 'none';
}

// 修改密码
function changePassword(e) {
    e.preventDefault();
    const currentPwd = currentPassword.value;
    const newPwd = newPassword.value;
    const confirmNewPwd = confirmNewPassword.value;
    
    // 验证输入
    if (!currentPwd || !newPwd || !confirmNewPwd) {
        changePasswordError.textContent = '请填写所有字段';
        return;
    }
    
    if (currentPwd !== currentUser.password) {
        changePasswordError.textContent = '当前密码错误';
        return;
    }
    
    if (newPwd !== confirmNewPwd) {
        changePasswordError.textContent = '新密码和确认密码不一致';
        return;
    }
    
    if (newPwd.length < 6) {
        changePasswordError.textContent = '新密码长度至少为6位';
        return;
    }
    
    // 更新用户密码
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].password = newPwd;
        currentUser.password = newPwd;
        saveUsersToStorage();
        localStorage.setItem('waterFilterCurrentUser', JSON.stringify(currentUser));
        closeChangePasswordModal();
        alert('密码修改成功');
    } else {
        changePasswordError.textContent = '用户不存在';
    }
}

// 获取当前用户的数据
function getCurrentUserCustomers() {
    if (!currentUser) return [];
    
    // 管理员可以看到所有数据
    if (currentUser.role === 'admin') {
        return customers;
    }
    
    // 普通用户只能看到自己的数据
    return customers.filter(customer => customer.userId === currentUser.id);
}

// 添加新客户
function addCustomer() {
    const name = customerNameInput.value.trim();
    const contactPerson = contactPersonInput.value.trim();
    const phoneNumber = phoneNumberInput.value.trim();
    const filterDate = filterPurchaseDateInput.value;
    const customInterval = customIntervalInput.value ? parseInt(customIntervalInput.value) : null;
    
    if (!name || !contactPerson || !phoneNumber || !filterDate) {
        alert('请填写所有字段');
        return;
    }
    
    // 验证自定义间隔
    if (customInterval !== null && (isNaN(customInterval) || customInterval <= 0)) {
        alert('请输入有效的间隔月份');
        return;
    }
    
    // 创建新客户对象
    const newCustomer = {
        id: Date.now(), // 使用时间戳作为唯一ID
        name,
        contactPerson,
        phoneNumber,
        filterPurchaseDate: filterDate,
        customInterval,
        userId: currentUser.id, // 关联用户ID
        createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    saveCustomersToStorage();
    renderReminderList();
    
    // 清空表单
    customerNameInput.value = '';
    contactPersonInput.value = '';
    phoneNumberInput.value = '';
    filterPurchaseDateInput.value = new Date().toISOString().split('T')[0];
    customIntervalInput.value = '';
}

// 导入数据（支持CSV和Excel）
function importData() {
    if (!csvFile.files.length) {
        importStatus.textContent = '请选择文件';
        importStatus.style.color = '#e74c3c';
        return;
    }
    
    const file = csvFile.files[0];
    const fileName = file.name.toLowerCase();
    
    // 根据文件扩展名判断文件类型
    if (fileName.endsWith('.csv')) {
        importCSV(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        importExcel(file);
    } else {
        importStatus.textContent = '不支持的文件格式，请选择CSV或Excel文件';
        importStatus.style.color = '#e74c3c';
    }
}

// 导入CSV数据
function importCSV(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        // 移除可能存在的BOM标记
        let cleanContent = content;
        if (cleanContent.charCodeAt(0) === 0xFEFF) {
            cleanContent = cleanContent.slice(1);
        }
        
        const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
        processImportedData(lines, ',');
    };
    
    reader.onerror = () => {
        importStatus.textContent = '读取CSV文件失败，请重试';
        importStatus.style.color = '#e74c3c';
    };
    
    // 尝试不同的编码格式
    try {
        reader.readAsText(file, 'UTF-8');
    } catch (e) {
        try {
            reader.readAsText(file, 'GBK');
        } catch (e2) {
            reader.readAsText(file);
        }
    }
}

// 导入Excel数据
function importExcel(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 将工作表转换为JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // 检查是否有数据
            if (jsonData.length === 0) {
                importStatus.textContent = 'Excel文件为空';
                importStatus.style.color = '#e74c3c';
                return;
            }
            
            // 转换为CSV格式的行
            const lines = jsonData.map(row => {
                return row.map(cell => {
                    // 处理单元格值，确保正确格式化
                    if (cell === null || cell === undefined) {
                        return '';
                    }
                    // 如果是字符串且包含逗号、引号或换行符，需要加引号
                    const cellStr = String(cell);
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return `"${cellStr.replace(/"/g, '""')}"`;
                    }
                    return cellStr;
                }).join(',');
            });
            
            processImportedData(lines, ',');
        } catch (error) {
            console.error('Excel解析错误:', error);
            importStatus.textContent = '解析Excel文件失败，请确保文件格式正确';
            importStatus.style.color = '#e74c3c';
        }
    };
    
    reader.onerror = () => {
        importStatus.textContent = '读取Excel文件失败，请重试';
        importStatus.style.color = '#e74c3c';
    };
    
    reader.readAsArrayBuffer(file);
}

// 处理导入的数据
function processImportedData(lines, defaultDelimiter) {
    let importedCount = 0;
    let skippedCount = 0;
    
    if (lines.length < 1) {
        importStatus.textContent = '文件为空或格式不正确';
        importStatus.style.color = '#e74c3c';
        return;
    }
    
    // 检测标题行（支持多种分隔符）
    let headers;
    let delimiter = defaultDelimiter; // 默认分隔符
    
    // 尝试检测分隔符（仅对CSV文件）
    if (defaultDelimiter === ',') {
        const firstLine = lines[0];
        const commaCount = (firstLine.match(/,/g) || []).length;
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const tabCount = (firstLine.match(/\t/g) || []).length;
        
        // 选择出现次数最多的分隔符
        if (tabCount > commaCount && tabCount > semicolonCount) {
            delimiter = '\t';
        } else if (semicolonCount > commaCount && semicolonCount > tabCount) {
            delimiter = ';';
        }
        
        // 如果所有分隔符计数都为0，但仍怀疑是制表符分隔（例如只有两列）
        if (commaCount === 0 && semicolonCount === 0 && tabCount === 0 && firstLine.includes('\t')) {
            delimiter = '\t';
        }
    }
    
    // 更健壮的标题处理，增强对中文编码的支持
    headers = lines[0].split(delimiter).map(header => {
        // 移除引号、前后空格和不可见字符
        let cleanHeader = header.trim().replace(/^["']|["']$/g, '').replace(/\uFEFF/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '');
        
        // 尝试解码可能的乱码字符
        try {
            // 如果包含乱码字符，尝试用不同的方式解析
            if (cleanHeader.includes('')) {
                // 尝试用GBK编码解析
                const decoded = decodeURIComponent(escape(cleanHeader));
                if (!decoded.includes('')) {
                    cleanHeader = decoded;
                }
            }
        } catch (e) {
            // 解码失败，保持原始值
        }
        
        return cleanHeader;
    });
    
    // 显示检测到的列标题用于调试
    console.log('检测到的列标题:', headers);
    console.log('分隔符:', delimiter === '\t' ? 'Tab' : delimiter);
    
    // 更灵活的列标题匹配，增强对中文编码的支持
    const nameIndex = headers.findIndex(header => {
        const cleanHeader = header.trim().toLowerCase();
        // 移除不可见字符
        const normalizedHeader = cleanHeader.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 支持多种可能的列名
        const possibleNames = ['客户名称', '客户', 'name', 'customer', 'cname', '客户名', 'ͻ'];
        return possibleNames.some(name => 
            normalizedHeader.includes(name) || 
            normalizedHeader.includes(name.toLowerCase()) ||
            normalizedHeader.includes(encodeURIComponent(name))
        );
    });
    
    const contactPersonIndex = headers.findIndex(header => {
        const cleanHeader = header.trim().toLowerCase();
        // 移除不可见字符
        const normalizedHeader = cleanHeader.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 支持多种可能的列名
        const possibleNames = ['联系人', '联系', 'contact', 'contactperson', 'person', '联系人姓名', 'ϵ'];
        return possibleNames.some(name => 
            normalizedHeader.includes(name) || 
            normalizedHeader.includes(name.toLowerCase()) ||
            normalizedHeader.includes(encodeURIComponent(name))
        );
    });
    
    const phoneNumberIndex = headers.findIndex(header => {
        const cleanHeader = header.trim().toLowerCase();
        // 移除不可见字符
        const normalizedHeader = cleanHeader.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 支持多种可能的列名
        const possibleNames = ['联系电话', '电话', '手机', 'phone', 'tel', 'telephone', 'mobile', '手机号', '手机号码', 'ϵ绰'];
        return possibleNames.some(name => 
            normalizedHeader.includes(name) || 
            normalizedHeader.includes(name.toLowerCase()) ||
            normalizedHeader.includes(encodeURIComponent(name))
        );
    });
    
    const filterDateIndex = headers.findIndex(header => {
        const cleanHeader = header.trim().toLowerCase();
        // 移除不可见字符
        const normalizedHeader = cleanHeader.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 支持多种可能的列名
        const possibleNames = ['滤芯购买日期', '购买日期', '购买时间', '日期', 'date', 'filter', 'time', '滤芯日期', 'о'];
        return possibleNames.some(name => 
            normalizedHeader.includes(name) || 
            normalizedHeader.includes(name.toLowerCase()) ||
            normalizedHeader.includes(encodeURIComponent(name))
        );
    });
    
    const customIntervalIndex = headers.findIndex(header => {
        const cleanHeader = header.trim().toLowerCase();
        // 移除不可见字符
        const normalizedHeader = cleanHeader.replace(/[\u200B-\u200D\uFEFF]/g, '');
        // 支持多种可能的列名
        const possibleNames = ['自定义间隔', '间隔', 'interval', 'custom', '自定义', '周期', '间隔月', 'Զ()'];
        return possibleNames.some(name => 
            normalizedHeader.includes(name) || 
            normalizedHeader.includes(name.toLowerCase()) ||
            normalizedHeader.includes(encodeURIComponent(name))
        );
    });
    
    // 验证必要的列是否存在
    if (nameIndex === -1 || contactPersonIndex === -1 || phoneNumberIndex === -1 || filterDateIndex === -1) {
        // 显示实际检测到的列标题，帮助用户调试
        const detectedHeaders = headers.map(h => `"${h}"`).join(', ');
        importStatus.innerHTML = `
            文件缺少必要的列: 需要客户名称,联系人,联系电话,滤芯购买日期<br>
            检测到的列: ${detectedHeaders}<br>
            使用的分隔符: ${delimiter === '\t' ? 'Tab' : delimiter}<br>
            <button onclick="downloadSampleCSV(event)">下载示例文件</button>
        `;
        importStatus.style.color = '#e74c3c';
        return;
    }
    
    // 从第二行开始处理数据
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(delimiter).map(item => {
            // 处理可能被引号包围的值
            let cleanItem = item.trim();
            if (cleanItem.startsWith('"') && cleanItem.endsWith('"')) {
                cleanItem = cleanItem.slice(1, -1).replace(/""/g, '"');
            }
            // 移除BOM标记
            cleanItem = cleanItem.replace(/\uFEFF/g, '');
            
            // 尝试解码可能的乱码字符
            try {
                if (cleanItem.includes('')) {
                    // 尝试用GBK编码解析
                    const decoded = decodeURIComponent(escape(cleanItem));
                    if (!decoded.includes('')) {
                        cleanItem = decoded;
                    }
                }
            } catch (e) {
                // 解码失败，保持原始值
            }
            
            return cleanItem;
        });
        
        // 确保列数足够
        if (columns.length <= Math.max(nameIndex, contactPersonIndex, phoneNumberIndex, filterDateIndex)) {
            skippedCount++;
            continue;
        }
        
        const name = columns[nameIndex];
        const contactPerson = columns[contactPersonIndex];
        const phoneNumber = columns[phoneNumberIndex];
        const filterDateStr = columns[filterDateIndex];
        const customIntervalStr = customIntervalIndex !== -1 ? columns[customIntervalIndex] : '';
        
        // 解析日期
        const parseDate = (dateStr) => {
            if (!dateStr) return null;
            
            // 移除可能的引号和前后空格
            let cleanDateStr = dateStr.trim();
            if (cleanDateStr.startsWith('"') && cleanDateStr.endsWith('"')) {
                cleanDateStr = cleanDateStr.slice(1, -1);
            }
            
            // 尝试多种日期格式
            const formats = [
                // YYYY-MM-DD 或 YYYY/MM/DD
                { regex: /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/, transform: (match) => `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}` },
                // MM-DD-YYYY 或 MM/DD/YYYY
                { regex: /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/, transform: (match) => `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}` },
                // DD-MM-YYYY 或 DD/MM/YYYY
                { regex: /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/, transform: (match) => `${match[3]}-${String(match[2]).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}` },
                // YYYY年MM月DD日
                { regex: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, transform: (match) => `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}` },
                // YYYY.MM.DD
                { regex: /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/, transform: (match) => `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}` },
                // YYYYMMDD
                { regex: /^(\d{4})(\d{2})(\d{2})$/, transform: (match) => `${match[1]}-${match[2]}-${match[3]}` },
            ];
            
            // 特殊处理：如果只有两种格式，可能是DD-MM-YYYY而不是MM-DD-YYYY
            // 我们需要根据数值范围来判断
            const parts = cleanDateStr.split(/[-/]/);
            if (parts.length === 3) {
                const first = parseInt(parts[0]);
                const second = parseInt(parts[1]);
                
                // 如果第一个数字大于12，那它不可能是月份，所以格式是DD-MM-YYYY
                if (first > 12) {
                    const match = cleanDateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                    if (match) {
                        return `${match[3]}-${String(match[2]).padStart(2, '0')}-${String(match[1]).padStart(2, '0')}`;
                    }
                }
                // 如果第二个数字大于12，那它不可能是月份，所以格式是MM-DD-YYYY
                else if (second > 12) {
                    const match = cleanDateStr.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
                    if (match) {
                        return `${match[3]}-${String(match[1]).padStart(2, '0')}-${String(match[2]).padStart(2, '0')}`;
                    }
                }
            }
            
            for (const format of formats) {
                const match = cleanDateStr.match(format.regex);
                if (match) {
                    try {
                        return format.transform(match);
                    } catch (e) {
                        console.error('日期转换错误:', e);
                        continue;
                    }
                }
            }
            
            // 如果所有格式都失败，尝试用JavaScript的Date对象解析
            try {
                // 特殊处理Excel序列号日期格式
                if (/^\d{5,}$/.test(cleanDateStr)) {
                    // Excel序列号日期（以1900年1月1日为起点）
                    const excelDate = parseInt(cleanDateStr);
                    // Excel序列号到JavaScript日期的转换
                    // Excel认为1900年是闰年，但实际上不是，所以需要减去2天
                    // 但是Excel序列号1对应1900年1月1日，JavaScript日期从1970年开始计算
                    const jsDate = new Date((excelDate - 25569) * 86400000);
                    if (jsDate instanceof Date && !isNaN(jsDate)) {
                        const year = jsDate.getFullYear();
                        const month = String(jsDate.getMonth() + 1).padStart(2, '0');
                        const day = String(jsDate.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    }
                }
                
                const date = new Date(cleanDateStr);
                if (date instanceof Date && !isNaN(date)) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.error('JavaScript Date解析错误:', e);
            }
            
            return null;
        };
        
        const filterDate = parseDate(filterDateStr);
        const customInterval = customIntervalStr ? parseInt(customIntervalStr) : null;
        
        // 验证数据
        if (name && contactPerson && phoneNumber && filterDate) {
            const newCustomer = {
                id: Date.now() + i, // 使用时间戳加索引作为唯一ID
                name,
                contactPerson,
                phoneNumber,
                filterPurchaseDate: filterDate,
                customInterval: customInterval && !isNaN(customInterval) ? customInterval : null,
                userId: currentUser.id, // 关联用户ID
                createdAt: new Date().toISOString()
            };
            
            customers.push(newCustomer);
            importedCount++;
        } else {
            skippedCount++;
        }
    }
    
    saveCustomersToStorage();
    renderReminderList();
    importStatus.textContent = `导入完成: 成功导入 ${importedCount} 条记录，跳过 ${skippedCount} 条无效记录`;
    importStatus.style.color = importedCount > 0 ? '#27ae60' : '#e74c3c';
    
    // 清空文件选择
    csvFile.value = '';
}

// 下载示例CSV
function downloadSampleCSV(e) {
    e.preventDefault();
    // 使用正确的UTF-8编码创建CSV内容
    const csvContent = "\uFEFF客户名称,联系人,联系电话,滤芯购买日期,自定义间隔(月)\n张三,张经理,13800138000,2025-01-15,\n李四,李主任,13900139000,2025-02-20,3\n王五,王师傅,13700137000,2025-03-15,6";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', '客户数据示例.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 导出客户数据
function exportCSV() {
    const userCustomers = getCurrentUserCustomers();
    
    if (userCustomers.length === 0) {
        alert('没有客户数据可导出');
        return;
    }
    
    // 创建CSV内容
    let csvContent = '客户名称,联系人,联系电话,滤芯购买日期,自定义间隔(月)\n';
    
    userCustomers.forEach(customer => {
        const customInterval = customer.customInterval || '';
        csvContent += `${customer.name},${customer.contactPerson},${customer.phoneNumber},${customer.filterPurchaseDate},${customInterval}\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `滤芯客户数据_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 计算提醒日期范围
function calculateReminderRange(filterDate, customInterval = null) {
    const date = new Date(filterDate);
    
    if (customInterval && !isNaN(customInterval)) {
        // 使用自定义间隔
        const minDate = new Date(date);
        minDate.setMonth(minDate.getMonth() + customInterval);
        
        const maxDate = new Date(date);
        maxDate.setMonth(maxDate.getMonth() + customInterval * 2);
        
        return {
            min: formatDate(minDate),
            max: formatDate(maxDate)
        };
    } else {
        // 使用默认间隔（2-4个月）
        const minDate = new Date(date);
        minDate.setMonth(minDate.getMonth() + 2);
        
        const maxDate = new Date(date);
        maxDate.setMonth(maxDate.getMonth() + 4);
        
        return {
            min: formatDate(minDate),
            max: formatDate(maxDate)
        };
    }
}

// 格式化日期为YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 渲染提醒列表
function renderReminderList() {
    reminderList.innerHTML = '';
    
    const userCustomers = getCurrentUserCustomers();
    
    if (userCustomers.length === 0) {
        reminderList.innerHTML = '<p>暂无客户记录</p>';
        return;
    }
    
    // 根据showAll标志过滤客户
    const showAll = showAllCheckbox.checked;
    let filteredCustomers = showAll ? userCustomers : userCustomers.filter(customer => {
        const reminderRange = calculateReminderRange(customer.filterPurchaseDate, customer.customInterval);
        const today = new Date();
        const minReminderDate = new Date(reminderRange.min);
        return today >= minReminderDate;
    });
    
    // 根据搜索框内容过滤客户（模糊匹配）
    if (customerSearch && customerSearch.value.trim() !== '') {
        const searchTerm = customerSearch.value.trim().toLowerCase();
        filteredCustomers = filteredCustomers.filter(customer => {
            return customer.name.toLowerCase().includes(searchTerm);
        });
    }
    
    if (filteredCustomers.length === 0) {
        reminderList.innerHTML = showAll ? '<p>暂无客户记录</p>' : '<p>暂无待跟进客户</p>';
        return;
    }
    
    // 按建议跟进时间从新到旧排序
    filteredCustomers.sort((a, b) => {
        const rangeA = calculateReminderRange(a.filterPurchaseDate, a.customInterval);
        const rangeB = calculateReminderRange(b.filterPurchaseDate, b.customInterval);
        // 从新到旧排序（最近的提醒时间排在前面）
        return new Date(rangeB.min) - new Date(rangeA.min);
    });
    
    filteredCustomers.forEach((customer, index) => {
        const reminderRange = calculateReminderRange(customer.filterPurchaseDate, customer.customInterval);
        const item = document.createElement('div');
        item.className = 'reminder-item';
        
        item.innerHTML = `
            <div class="customer-header">
                <h3>${customer.name}</h3>
                <button class="delete-btn" data-id="${customer.id}">删除</button>
            </div>
            <div class="reminder-dates">
                <p>联系人: ${customer.contactPerson}</p>
                <p>联系电话: ${customer.phoneNumber}</p>
                <p>滤芯购买日期: ${customer.filterPurchaseDate}</p>
                <p>自定义间隔: ${customer.customInterval ? customer.customInterval + '个月' : '默认(2-4个月)'}</p>
            </div>
            <div class="customer-actions">
                <input type="date" class="update-date-input" data-id="${customer.id}" value="${customer.filterPurchaseDate}">
                <button class="update-date-btn" data-id="${customer.id}">更新日期</button>
                <input type="number" class="custom-interval-input" data-id="${customer.id}" placeholder="自定义间隔(月)" value="${customer.customInterval || ''}">
                <button class="update-interval-btn" data-id="${customer.id}">设置间隔</button>
            </div>
            <p class="reminder-range">建议跟进时间: ${reminderRange.min} 至 ${reminderRange.max}</p>
        `;
        reminderList.appendChild(item);
    });
    
    // 添加删除按钮事件监听
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const customerId = parseInt(e.target.getAttribute('data-id'));
            deleteCustomer(customerId);
        });
    });
    
    // 添加更新日期按钮事件监听
    document.querySelectorAll('.update-date-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const customerId = parseInt(e.target.getAttribute('data-id'));
            const newDate = e.target.previousElementSibling.value;
            updateFilterDate(customerId, newDate);
        });
    });
    
    // 添加更新间隔按钮事件监听
    document.querySelectorAll('.update-interval-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const customerId = parseInt(e.target.getAttribute('data-id'));
            const newInterval = e.target.previousElementSibling.value;
            updateCustomInterval(customerId, newInterval);
        });
    });
}

// 更新滤芯购买日期
function updateFilterDate(customerId, newDate) {
    if (!newDate) {
        alert('请选择有效日期');
        return;
    }
    
    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex !== -1) {
        // 验证用户权限
        if (currentUser.role !== 'admin' && customers[customerIndex].userId !== currentUser.id) {
            alert('您没有权限修改此客户信息');
            return;
        }
        
        customers[customerIndex].filterPurchaseDate = newDate;
        saveCustomersToStorage();
        renderReminderList();
    }
}

// 更新自定义间隔
function updateCustomInterval(customerId, newInterval) {
    const interval = newInterval ? parseInt(newInterval) : null;
    
    if (interval !== null && (isNaN(interval) || interval <= 0)) {
        alert('请输入有效的间隔月份');
        return;
    }
    
    const customerIndex = customers.findIndex(c => c.id === customerId);
    if (customerIndex !== -1) {
        // 验证用户权限
        if (currentUser.role !== 'admin' && customers[customerIndex].userId !== currentUser.id) {
            alert('您没有权限修改此客户信息');
            return;
        }
        
        customers[customerIndex].customInterval = interval;
        saveCustomersToStorage();
        renderReminderList();
    }
}

// 删除客户
function deleteCustomer(customerId) {
    if (confirm('确定要删除这个客户吗？')) {
        const customerIndex = customers.findIndex(c => c.id === customerId);
        if (customerIndex !== -1) {
            // 验证用户权限
            if (currentUser.role !== 'admin' && customers[customerIndex].userId !== currentUser.id) {
                alert('您没有权限删除此客户信息');
                return;
            }
            
            customers.splice(customerIndex, 1);
            saveCustomersToStorage();
            renderReminderList();
        }
    }
}
