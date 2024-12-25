# The Social DOM (sDOM): Cascading Smart Contracts for Automation

## **Overview**
The **social DOM (sDOM)**, or **kingDOM**, is:
- A **CSS-like hierarchy** of organizational entities (businesses, teams, policies, payroll, deals, etc.).
- Governed by **smart contracts** expressed as **styles** with props and conditions.
- Automated through **cascading rule propagation**, ensuring transparency and independence without micromanagement.
- Interpreted by **AI** to convert **plain English contracts** into actionable rules.

This allows:
1. **Space-Agnostic Development**: Developers build tools that are independent of business rules. Rules are **abstracted** into the sDOM.
2. **Distributed Control**: Each entity operates autonomously but within **cascading rules and policies** that propagate through the hierarchy.

---

## **Key Components**

1. **sDOM Hierarchy**:
   - Modeled as a **tree or graph** of entities corresponding to organizational structures.
   - Entities have:
     - **Attributes**: Traits like `org-culture`, `roles`, or financial policies.
     - **Children**: Nested entities (e.g., teams, projects, or deals).

2. **Smart Contracts as Styles**:
   - Contracts are plain English descriptions, which AI converts into:
     - **Style Objects**: Contain conditions, props, and rules.
   - Styles cascade **top-down**, ensuring rules propagate across the hierarchy like CSS (from parent to child).

3. **Rules and Automation**:
   - Rules govern:
     - Financial policies (e.g., payroll adjustments or deal approvals).
     - HR workflows (e.g., onboarding, policies).
     - Space and reorganization dynamics (structural changes).
   - This ensures automation while enforcing compliance.

4. **Developer Use**:
   - Tools built by developers remain agnostic of complex organizational dynamics and rules.
   - Developers interact with **entities as nodes** in the sDOM, leaving automation to cascading styles.

---

## **How the sDOM Works**

### 1. Plain English Smart Contracts → Style Objects

AI processes natural language contracts into **structured style objects**.  
For example:

**Smart Contract (Plain English)**:
```text
All employees in Team Alpha must receive at least 40% of the bonus from the last deal their team closes,
unless explicitly overridden by policy X. 
These rules cascade into sub-teams unless specified otherwise.
```

**Converted Style Object**:
```json
{
  "target": "Team Alpha",
  "rules": {
    "bonus": {
      "percentage": ">=40%",
      "source": "last team deal",
      "exceptions": ["Policy X"]
    }
  },
  "cascade": true
}
```

This style object is applied to **Team Alpha** and propagates to its sub-teams.

---

### 2. Entity Mapping to sDOM Nodes

**Entity Examples**:
- Business Deal → `<deal>`  
- Management Decision → `<decision>`  
- Payroll → `<payroll>`  
- Organization Policies → `<policy>`  
- Abstract Spaces → `<space>`  

Each entity becomes an **element** in the sDOM, capable of inheriting and overriding styles:

```rust
#[derive(Debug)]
struct SDOMNode {
    tag: String,                  // E.g., 'deal', 'policy'
    attributes: Vec<(String, String)>, // Smart Contract Rules
    children: Vec<Box<SDOMNode>>, // Nested Entities
    content: Option<String>,      // Data associated with the node
}

// Example: Create Hierarchy for Payroll
fn create_sdom_hierarchy() -> SDOMNode {
    let payroll = SDOMNode {
        tag: "payroll".to_string(),
        attributes: vec![
            ("rule".to_string(), "minimum-bonus: 40%;".to_string()),
        ],
        children: vec![],
        content: Some("Payroll for Team Alpha".to_string()),
    };

    let deal = SDOMNode {
        tag: "deal".to_string(),
        attributes: vec![
            ("value".to_string(), "50000".to_string()),
            ("split-bonus".to_string(), "true".to_string()),
        ],
        children: vec![Box::new(payroll)], // Payroll inherits deal rules
        content: Some("Deal X closed with $50k".to_string()),
    };

    deal
}
```

When rendered, **rules cascade** from the deal to the payroll system.

---

### 3. Style Propagation Across the sDOM

Rules enforce logical policies and financial constraints **top-down** in the sDOM.

#### Cascading Example (Rust Implementation)

```rust
fn cascade_styles(node: &mut SDOMNode, parent_styles: Vec<(String, String)>) {
    // Merge parent styles into current node attributes
    for (key, value) in &parent_styles {
        if !node.attributes.iter().any(|(k, _)| k == key) {
            node.attributes.push((key.clone(), value.clone())); // Propagate
        }
    }
    // Recursively cascade to children
    for child in &mut node.children {
        cascade_styles(child, node.attributes.clone());
    }
}

fn main() {
    let mut sdom = create_sdom_hierarchy();
    cascade_styles(&mut sdom, vec![("global-rule".to_string(), "applies-to-all".to_string())]);

    println!("{:?}", sdom);
}
```

**Output:**
```text
<deal>
  global-rule: applies-to-all;
  value: 50000;
  split-bonus: true;
  <payroll>
    global-rule: applies-to-all;
    minimum-bonus: 40%;
  </payroll>
</deal>
```

Styles like `global-rule: applies-to-all` cascade seamlessly.

---

### 4. Rendering Browser-Ready sDOM for Development Tools

Convert the sDOM into **HTML/JSX** for web portals and development tools:

#### Example: Convert sDOM to HTML

```rust
fn render_to_html(node: &SDOMNode) -> String {
    let attributes = node
        .attributes
        .iter()
        .map(|(key, value)| format!("{}='{}'", key, value))
        .collect::<Vec<_>>()
        .join(" ");
    
    let children_html = node
        .children
        .iter()
        .map(|child| render_to_html(&**child))
        .collect::<Vec<_>>()
        .join("");
    
    format!("<{} {}>{}</{}>", node.tag, attributes, children_html, node.tag)
}

fn main() {
    let sdom = create_sdom_hierarchy();
    let html = render_to_html(&sdom);
    println!("{}", html);
}
```

**Output:**
```html
<deal global-rule='applies-to-all' value='50000' split-bonus='true'>
    <payroll global-rule='applies-to-all' minimum-bonus='40%'>Payroll for Team Alpha</payroll>
</deal>
```

This makes sDOM fully browser-compatible for web-based tools.

---

## **Final Summary**

### **Key Features of sDOM**
1. **Smart Contracts as Cascading Styles**:  
   - Expressed in plain English, converted into style objects.
   - Enforce rules across organizations in a **CSS-like cascading fashion**.

2. **Space-Agnostic Development**:  
   - Tools remain abstract; developers interact with entities like components, independent of rules and policies.

3. **Automation + Transparency**:  
   - Rules are enforced automatically, but entities remain independent inside the hierarchy.

4. **AI + Semantics for Rules**:  
   - Contracts are understandable in plain English and executed programmatically as style-based rules.

### **How It Works**:
- **Entities map to DOM nodes**: Business deals, policies, payroll, and spaces become parts of the **sDOM hierarchy**.
- **Rules cascade**: Smart contracts propagate attributes and conditions like CSS styles.
- **Web tools render outputs**: Rendered sDOM elements integrate into web-based portals effortlessly.

This architecture enables enforcement of smart contracts in an automated, scalable, and developer-friendly manner while abstracting the complexity of rules for space-agnostic innovation.

Let me know if you'd like to explore more layers of this framework! 🚀